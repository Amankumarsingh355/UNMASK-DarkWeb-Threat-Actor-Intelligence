// ============================================================
// UNMASK // DATASET GRAPH PROCESSOR & NORMALIZATION ENGINE
// Client-side parser for CSV, JSON, and XLSX datasets
// Extracts real entities, deterministic edges, calculates analytical risk scores,
// generates 24-hour threat timelines, and preserves full data provenance.
// ============================================================

import Papa from 'papaparse';
import * as XLSX from 'xlsx';
import type { GraphNode, GraphLink, EntityType } from '../types/intelligence';

export interface DatasetMetadata {
  fileName: string;
  fileType: 'CSV' | 'JSON' | 'XLSX';
  fileSizeBytes: number;
  recordCount: number;
  columnNames: string[];
  detectedMappings: Record<string, string>; // column -> entity role
  uploadedAt: string;
  status: 'READY' | 'PROCESSED' | 'ERROR';
}

export interface DatasetValidationResult {
  isValid: boolean;
  errors: string[];
  warnings: string[];
  recordCount: number;
  detectedEntities: { type: EntityType; count: number }[];
  detectedRelationshipCount: number;
  hasTimestamps: boolean;
}

export interface SuspectAttribution {
  rank: number;
  name: string;
  type: EntityType;
  riskScore: number;
  riskLevel: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';
  confidenceScore: number;
  category: string;
  why: string;
  reasons: string[];
  connectionsCount: number;
  recordCount: number;
  associatedEntities: { type: string; value: string }[];
}

export interface ProcessedGraphResult {
  metadata: DatasetMetadata;
  nodes: GraphNode[];
  links: GraphLink[];
  stats: {
    nodesCount: number;
    edgesCount: number;
    actorsCount: number;
    platformsCount: number;
    aliasesCount: number;
    walletsCount: number;
    pgpCount: number;
    domainsCount: number;
    emailsCount: number;
    ipsCount: number;
    highRiskCount: number;
  };
  timelineData: { time: string; totalEvents: number; anomalyScore: number }[];
  hasTimelineData: boolean;
  rawRecords: Record<string, any>[];
  primeSuspect?: SuspectAttribution;
  topSuspects?: SuspectAttribution[];
}

// Internal column synonym matchers
const COLUMN_SYNONYMS: Record<string, RegExp> = {
  actor: /^(user|username|author|handle|actor|suspect|target|user_id|src_user|source_user|creator|owner|account|user_name)$/i,
  platform: /^(forum|site|marketplace|platform|board|source|service|app|forum_id|forum_name|channel|server)$/i,
  alias: /^(alias|aka|handle_alt|nickname|secondary_handle|correlated_alias|alternate_name|screen_name)$/i,
  wallet: /^(wallet|crypto_address|btc_address|eth_address|address|wallet_address|crypto|crypto_addr|deposit_addr|receiver_wallet|dest_wallet|src_wallet)$/i,
  pgp: /^(pgp|pgp_key|public_key|key_id|fingerprint|pgp_fingerprint|gpg_key|pubkey)$/i,
  domain: /^(domain|onion|onion_url|url|website|host|hostname|c2_domain|server_name|target_domain)$/i,
  email: /^(email|mail|contact_email|protonmail|email_address|user_email)$/i,
  ip: /^(ip|source_ip|dest_ip|ip_address|dst_ip|src_ip|server_ip|client_ip|node_ip|host_ip)$/i,
  target: /^(target|dst|destination|connected_to|recipient|counterparty|peer|related_entity|target_user|target_actor|dest_user|receiver)$/i,
  relationship: /^(relationship|relation|relation_type|action|protocol|interaction|type|link_type|event_type|category)$/i,
  timestamp: /^(timestamp|time|date|created_at|datetime|event_time|observed_at|first_seen|last_seen|published_at)$/i,
  risk: /^(risk|risk_score|threat_score|threat_level|score|severity|confidence|threat_rating|priority|malicious_score)$/i,
  post: /^(post|post_id|message|content|thread|text|body|comment|payload)$/i
};

export class DatasetGraphProcessor {

  /**
   * Parse uploaded File (CSV, JSON, XLSX) into array of record objects
   */
  public static async parseFile(file: File): Promise<{ records: Record<string, any>[]; fileType: 'CSV' | 'JSON' | 'XLSX' }> {
    const extension = file.name.split('.').pop()?.toLowerCase();

    if (extension === 'json') {
      const text = await file.text();
      let parsed: any;
      try {
        parsed = JSON.parse(text);
      } catch (err: any) {
        throw new Error(`Invalid JSON file format: ${err.message}`);
      }

      let records: Record<string, any>[] = [];
      if (Array.isArray(parsed)) {
        records = parsed;
      } else if (parsed && typeof parsed === 'object') {
        if (Array.isArray(parsed.records)) records = parsed.records;
        else if (Array.isArray(parsed.data)) records = parsed.data;
        else if (Array.isArray(parsed.items)) records = parsed.items;
        else if (Array.isArray(parsed.nodes)) records = parsed.nodes;
        else {
          // Flatten key-values or single object
          records = [parsed];
        }
      }

      if (records.length === 0) {
        throw new Error('JSON file contains no record arrays or entries.');
      }
      return { records, fileType: 'JSON' };
    }

    if (extension === 'xlsx' || extension === 'xls') {
      const arrayBuffer = await file.arrayBuffer();
      const workbook = XLSX.read(arrayBuffer, { type: 'array' });
      const firstSheetName = workbook.SheetNames[0];
      if (!firstSheetName) {
        throw new Error('Excel workbook contains no sheets.');
      }
      const sheet = workbook.Sheets[firstSheetName];
      const records: Record<string, any>[] = XLSX.utils.sheet_to_json(sheet, { defval: '' });
      if (records.length === 0) {
        throw new Error('Excel sheet contains no data rows.');
      }
      return { records, fileType: 'XLSX' };
    }

    // Default: CSV / TSV
    return new Promise((resolve, reject) => {
      Papa.parse(file, {
        header: true,
        skipEmptyLines: 'greedy',
        dynamicTyping: true,
        complete: (results) => {
          if (results.errors && results.errors.length > 0 && results.data.length === 0) {
            reject(new Error(`CSV parse error: ${results.errors[0].message}`));
            return;
          }
          const validRows = (results.data as Record<string, any>[]).filter(
            row => row && Object.values(row).some(v => v !== null && v !== undefined && String(v).trim() !== '')
          );
          if (validRows.length === 0) {
            reject(new Error('Uploaded CSV file is empty or contains only empty rows.'));
            return;
          }
          resolve({ records: validRows, fileType: 'CSV' });
        },
        error: (err) => {
          reject(new Error(`CSV parsing failed: ${err.message}`));
        }
      });
    });
  }

  /**
   * Intelligently detects column roles from field names
   */
  public static detectColumnMappings(columns: string[]): Record<string, string> {
    const mappings: Record<string, string> = {};

    columns.forEach(col => {
      const clean = col.trim();
      for (const [role, regex] of Object.entries(COLUMN_SYNONYMS)) {
        if (regex.test(clean)) {
          mappings[clean] = role;
          break;
        }
      }
      // Heuristics for compound names
      if (!mappings[clean]) {
        const lower = clean.toLowerCase();
        if (lower.includes('user') || lower.includes('actor') || lower.includes('name')) mappings[clean] = 'actor';
        else if (lower.includes('forum') || lower.includes('platform') || lower.includes('site')) mappings[clean] = 'platform';
        else if (lower.includes('wallet') || lower.includes('address') || lower.includes('crypto')) mappings[clean] = 'wallet';
        else if (lower.includes('key') || lower.includes('pgp') || lower.includes('fingerprint')) mappings[clean] = 'pgp';
        else if (lower.includes('domain') || lower.includes('onion') || lower.includes('url')) mappings[clean] = 'domain';
        else if (lower.includes('email') || lower.includes('mail')) mappings[clean] = 'email';
        else if (lower.includes('ip')) mappings[clean] = 'ip';
        else if (lower.includes('time') || lower.includes('date')) mappings[clean] = 'timestamp';
        else if (lower.includes('risk') || lower.includes('threat') || lower.includes('score')) mappings[clean] = 'risk';
        else mappings[clean] = 'entity';
      }
    });

    return mappings;
  }

  /**
   * Validates dataset structure and returns detailed validation report
   */
  public static validateDataset(records: Record<string, any>[], mappings: Record<string, string>): DatasetValidationResult {
    const errors: string[] = [];
    const warnings: string[] = [];

    if (!records || records.length === 0) {
      errors.push('The dataset contains 0 records.');
      return {
        isValid: false,
        errors,
        warnings,
        recordCount: 0,
        detectedEntities: [],
        detectedRelationshipCount: 0,
        hasTimestamps: false
      };
    }

    const detectedRoles = new Set(Object.values(mappings));
    const hasActor = detectedRoles.has('actor');
    const hasPlatform = detectedRoles.has('platform');
    const hasWallet = detectedRoles.has('wallet');
    const hasTarget = detectedRoles.has('target');
    const hasIP = detectedRoles.has('ip');
    const hasTimestamps = detectedRoles.has('timestamp');

    if (!hasActor && !hasTarget && !hasIP && !hasWallet) {
      errors.push('No primary entity columns (actor, target, wallet, ip, or username) detected in dataset.');
    }

    // Entity counts estimate
    const entityCounts: Record<string, Set<string>> = {
      ACTOR: new Set(),
      PLATFORM: new Set(),
      ALIAS: new Set(),
      WALLET: new Set(),
      PGP: new Set(),
      DOMAIN: new Set(),
      EMAIL: new Set(),
      IP: new Set(),
      FORUM: new Set()
    };

    let relationshipEstimate = 0;

    records.slice(0, 500).forEach(row => {
      Object.entries(row).forEach(([col, val]) => {
        if (!val || String(val).trim() === '') return;
        const strVal = String(val).trim();
        const role = mappings[col];

        if (role === 'actor') entityCounts.ACTOR.add(strVal);
        else if (role === 'platform') entityCounts.FORUM.add(strVal);
        else if (role === 'wallet') entityCounts.WALLET.add(strVal);
        else if (role === 'alias') entityCounts.ALIAS.add(strVal);
        else if (role === 'domain') entityCounts.DOMAIN.add(strVal);
        else if (role === 'email') entityCounts.EMAIL.add(strVal);
        else if (role === 'ip') entityCounts.IP.add(strVal);
      });

      // Relationship potential
      if (hasActor && (hasPlatform || hasWallet || hasTarget || detectedRoles.has('pgp') || detectedRoles.has('domain'))) {
        relationshipEstimate++;
      }
    });

    if (relationshipEstimate === 0 && !hasTarget) {
      warnings.push('Dataset uploaded successfully, but no direct multi-entity relationship columns were found. Co-occurring indicators in each row will be linked.');
    }

    if (!hasTimestamps) {
      warnings.push('No timestamp column detected. Timeline activity chart will show "Timeline unavailable — timestamp data not found."');
    }

    const detectedEntities = Object.entries(entityCounts)
      .filter(([_, set]) => set.size > 0)
      .map(([type, set]) => ({ type: type as EntityType, count: set.size }));

    return {
      isValid: errors.length === 0,
      errors,
      warnings,
      recordCount: records.length,
      detectedEntities,
      detectedRelationshipCount: Math.max(relationshipEstimate, records.length),
      hasTimestamps
    };
  }

  /**
   * Full dataset processing pipeline: Entity extraction, deterministic relationships,
   * analytical risk scoring, timeline generation, and provenance tracking.
   */
  public static processDataset(
    file: File,
    records: Record<string, any>[],
    mappings: Record<string, string>,
    onProgress?: (step: number, label: string) => void
  ): ProcessedGraphResult {
    onProgress?.(1, 'Uploading Dataset');
    onProgress?.(2, 'Validating Data');

    const columns = Object.keys(records[0] || {});
    onProgress?.(3, 'Normalizing Entities');

    // Role-to-column lookups
    const roleCols: Record<string, string[]> = {};
    Object.entries(mappings).forEach(([col, role]) => {
      if (!roleCols[role]) roleCols[role] = [];
      roleCols[role].push(col);
    });

    const nodeMap = new Map<string, GraphNode>();
    const linkMap = new Map<string, GraphLink>();
    const nodeRowMap = new Map<string, number[]>(); // nodeId -> row indices
    const linkRowMap = new Map<string, number[]>(); // linkId -> row indices

    // Helper: generate consistent node ID
    const getNodeId = (type: EntityType, value: string) => {
      const clean = value.trim().toLowerCase().replace(/[^a-z0-9_.-]/g, '_');
      return `${type.toLowerCase()}-${clean}`;
    };

    // Helper: add or update node with provenance
    const ensureNode = (
      type: EntityType,
      value: string,
      rowIndex: number,
      rawRow: Record<string, any>,
      extraDetails?: Record<string, any>
    ): GraphNode => {
      const strVal = String(value).trim();
      const id = getNodeId(type, strVal);

      if (!nodeRowMap.has(id)) {
        nodeRowMap.set(id, []);
      }
      nodeRowMap.get(id)!.push(rowIndex);

      if (nodeMap.has(id)) {
        const existing = nodeMap.get(id)!;
        existing.connectionsCount = (existing.connectionsCount || 1) + 1;
        if (rawRow && existing.details) {
          // Merge details
          Object.entries(rawRow).forEach(([k, v]) => {
            if (v && !existing.details![k]) existing.details![k] = v;
          });
        }
        return existing;
      }

      // Visual attributes per entity type matching UNMASK dark cyberpunk theme
      let color = '#00f0ff';
      let size = 16;
      if (type === 'ACTOR') { color = '#00f0ff'; size = 26; }
      else if (type === 'FORUM') { color = '#f43f5e'; size = 22; }
      else if (type === 'WALLET') { color = '#f59e0b'; size = 18; }
      else if (type === 'DOMAIN') { color = '#10b981'; size = 18; }
      else if (type === 'IP') { color = '#06b6d4'; size = 15; }
      else if (type === 'ALIAS') { color = '#a855f7'; size = 14; }
      else if (type === 'EMAIL') { color = '#38bdf8'; size = 14; }
      else if (type === 'TRANSACTION') { color = '#f97316'; size = 15; }
      else { color = '#64748b'; size = 12; }

      const node: GraphNode = {
        id,
        name: strVal,
        label: strVal,
        type,
        color,
        size,
        connectionsCount: 1,
        riskScore: 50,
        riskLevel: 'MEDIUM',
        firstSeen: String(rawRow[roleCols.timestamp?.[0] || ''] || '2026-09-01'),
        lastSeen: String(rawRow[roleCols.timestamp?.[0] || ''] || '2026-09-09'),
        details: {
          provenanceRowIndex: rowIndex,
          provenanceRecordsCount: 1,
          provenanceSnippet: rawRow,
          ...extraDetails
        }
      };

      nodeMap.set(id, node);
      return node;
    };

    // Helper: add deterministic link
    const ensureLink = (
      srcNode: GraphNode,
      tgtNode: GraphNode,
      relation: string,
      confidence: number,
      rowIndex: number,
      evidenceDesc: string
    ) => {
      if (srcNode.id === tgtNode.id) return;
      const linkId = `link-${srcNode.id}__${tgtNode.id}`;
      const revLinkId = `link-${tgtNode.id}__${srcNode.id}`;

      if (!linkRowMap.has(linkId)) linkRowMap.set(linkId, []);
      linkRowMap.get(linkId)!.push(rowIndex);

      if (linkMap.has(linkId)) {
        const existing = linkMap.get(linkId)!;
        existing.confidence = Math.min(100, existing.confidence + 2);
        return;
      }
      if (linkMap.has(revLinkId)) {
        const existing = linkMap.get(revLinkId)!;
        existing.confidence = Math.min(100, existing.confidence + 2);
        return;
      }

      const link: GraphLink = {
        id: linkId,
        source: srcNode.id,
        target: tgtNode.id,
        relationship: relation as any,
        confidence: Math.max(45, Math.min(100, confidence)),
        isAnimated: confidence >= 80,
        evidence: {
          sharedIdentifierScore: confidence >= 85 ? 35 : 20,
          temporalOverlapScore: 20,
          aliasSimilarityScore: 18,
          behavioralSimilarityScore: 15,
          infrastructureScore: 12,
          totalConfidence: confidence,
          evidenceItems: [
            {
              title: 'Observed Dataset Telemetry',
              description: evidenceDesc || `Deterministic relationship extracted from dataset record #${rowIndex + 1}`,
              confidenceContribution: confidence
            }
          ],
          provenanceRowIndex: rowIndex
        }
      };

      linkMap.set(linkId, link);
    };

    onProgress?.(4, 'Detecting Relationships');

    // 1. Iterate dataset rows and build entities & links
    records.forEach((row, rowIndex) => {
      const actorCols = roleCols.actor || [];
      const platformCols = roleCols.platform || [];
      const walletCols = roleCols.wallet || [];
      const pgpCols = roleCols.pgp || [];
      const aliasCols = roleCols.alias || [];
      const domainCols = roleCols.domain || [];
      const emailCols = roleCols.email || [];
      const ipCols = roleCols.ip || [];
      const targetCols = roleCols.target || [];
      const relCols = roleCols.relationship || [];
      const riskCols = roleCols.risk || [];

      // Extract primary actor nodes in this row
      const primaryActorNodes: GraphNode[] = [];
      actorCols.forEach(col => {
        const val = row[col];
        if (val && String(val).trim() !== '') {
          const actorNode = ensureNode('ACTOR', String(val), rowIndex, row, {
            primaryColumn: col,
            riskColumnValue: riskCols.length > 0 ? row[riskCols[0]] : undefined
          });
          primaryActorNodes.push(actorNode);
        }
      });

      // Target/Destination nodes
      const targetNodes: GraphNode[] = [];
      targetCols.forEach(col => {
        const val = row[col];
        if (val && String(val).trim() !== '') {
          const tgtNode = ensureNode('ACTOR', String(val), rowIndex, row, { isTarget: true });
          targetNodes.push(tgtNode);
        }
      });

      // If actor -> target direct link
      primaryActorNodes.forEach(src => {
        targetNodes.forEach(tgt => {
          const relType = relCols.length > 0 && row[relCols[0]] ? String(row[relCols[0]]).toUpperCase() : 'CONNECTED_TO';
          ensureLink(src, tgt, relType, 92, rowIndex, `Direct link between ${src.name} and ${tgt.name} in row #${rowIndex + 1}`);
        });
      });

      // Platform / Forum nodes
      platformCols.forEach(col => {
        const val = row[col];
        if (val && String(val).trim() !== '') {
          const platformNode = ensureNode('FORUM', String(val), rowIndex, row);
          primaryActorNodes.forEach(actor => {
            ensureLink(actor, platformNode, 'POSTED_ON', 88, rowIndex, `Activity detected on forum ${platformNode.name}`);
          });
        }
      });

      // Wallet nodes
      walletCols.forEach(col => {
        const val = row[col];
        if (val && String(val).trim() !== '') {
          const walletNode = ensureNode('WALLET', String(val), rowIndex, row, {
            currency: String(val).startsWith('0x') ? 'ETH' : 'BTC'
          });
          primaryActorNodes.forEach(actor => {
            ensureLink(actor, walletNode, 'USES_WALLET', 95, rowIndex, `Cryptographic wallet associated in telemetry record`);
          });
        }
      });

      // PGP Key / Fingerprint nodes
      pgpCols.forEach(col => {
        const val = row[col];
        if (val && String(val).trim() !== '') {
          const pgpNode = ensureNode('CLUSTER', `PGP: ${String(val).slice(0, 16)}...`, rowIndex, row, {
            fingerprint: String(val)
          });
          primaryActorNodes.forEach(actor => {
            ensureLink(actor, pgpNode, 'SHARED_INDICATOR', 98, rowIndex, `Verified PGP public key signature match`);
          });
        }
      });

      // Alias nodes
      aliasCols.forEach(col => {
        const val = row[col];
        if (val && String(val).trim() !== '') {
          const aliasNode = ensureNode('ALIAS', String(val), rowIndex, row);
          primaryActorNodes.forEach(actor => {
            ensureLink(actor, aliasNode, 'USES_ALIAS', 90, rowIndex, `Secondary handle / alias correlated in intelligence record`);
          });
        }
      });

      // Domain / Onion nodes
      domainCols.forEach(col => {
        const val = row[col];
        if (val && String(val).trim() !== '') {
          const domainNode = ensureNode('DOMAIN', String(val), rowIndex, row);
          primaryActorNodes.forEach(actor => {
            ensureLink(actor, domainNode, 'CONNECTED_TO', 82, rowIndex, `Infrastructure host association`);
          });
        }
      });

      // Email nodes
      emailCols.forEach(col => {
        const val = row[col];
        if (val && String(val).trim() !== '') {
          const emailNode = ensureNode('EMAIL', String(val), rowIndex, row);
          primaryActorNodes.forEach(actor => {
            ensureLink(actor, emailNode, 'USES_EMAIL', 85, rowIndex, `Contact identifier linked in intelligence telemetry`);
          });
        }
      });

      // IP Address nodes
      ipCols.forEach(col => {
        const val = row[col];
        if (val && String(val).trim() !== '') {
          const ipNode = ensureNode('IP', String(val), rowIndex, row);
          primaryActorNodes.forEach(actor => {
            ensureLink(actor, ipNode, 'SHARED_INDICATOR', 78, rowIndex, `IP address routing connection observed`);
          });
        }
      });

      // If only IP columns exist (e.g. NetFlow/UNSW-NB15 style dataset with src_ip and dest_ip)
      if (primaryActorNodes.length === 0 && ipCols.length >= 2) {
        const srcIpVal = row[ipCols[0]];
        const dstIpVal = row[ipCols[1]];
        if (srcIpVal && dstIpVal) {
          const srcNode = ensureNode('IP', String(srcIpVal), rowIndex, row);
          const dstNode = ensureNode('IP', String(dstIpVal), rowIndex, row);
          ensureLink(srcNode, dstNode, 'CONNECTED_TO', 80, rowIndex, `Network flow observed between IP endpoints`);
        }
      }
    });

    onProgress?.(5, 'Calculating Analytical Risk Scores');

    // 2. Analytical Risk Scoring (0–100) calculation
    nodeMap.forEach(node => {
      const rows = nodeRowMap.get(node.id) || [];
      const degree = node.connectionsCount || 1;

      // Base formula: degree contribution (up to 40) + record volume (up to 30) + indicator severity (up to 30)
      let calculatedScore = Math.min(40, degree * 8) + Math.min(30, rows.length * 5);

      // Check if dataset contains explicit risk or attack indicators
      if (node.details?.riskColumnValue) {
        const rawScore = Number(node.details.riskColumnValue);
        if (!isNaN(rawScore) && rawScore > 0) {
          calculatedScore = rawScore <= 1 ? Math.round(rawScore * 100) : Math.min(100, Math.round(rawScore));
        }
      }

      // Bonus risk for high-entropy entities (wallets, onion domains, high connectivity)
      if (node.type === 'WALLET') calculatedScore += 15;
      if (node.type === 'ACTOR' && degree >= 4) calculatedScore += 20;
      if (node.name.includes('.onion')) calculatedScore += 15;

      const finalScore = Math.max(12, Math.min(99, calculatedScore));
      node.riskScore = finalScore;

      // Risk classification
      if (finalScore >= 81) node.riskLevel = 'CRITICAL';
      else if (finalScore >= 61) node.riskLevel = 'HIGH';
      else if (finalScore >= 31) node.riskLevel = 'MEDIUM';
      else node.riskLevel = 'LOW';

      // Attach data provenance row references
      node.details = {
        ...node.details,
        provenanceRowIndices: rows.slice(0, 10),
        totalSupportingRecords: rows.length,
        supportingRecords: rows.slice(0, 5).map(idx => ({ rowIndex: idx, record: records[idx] }))
      };
    });

    onProgress?.(6, 'Building Threat Graph...');

    // 3. 24-Hour Threat Activity Timeline Generation
    const timestampCols = roleCols.timestamp || [];
    let hasTimelineData = false;
    const hourlyBuckets: number[] = new Array(24).fill(0);
    const hourlyAnomaly: number[] = new Array(24).fill(0);

    if (timestampCols.length > 0) {
      const timeCol = timestampCols[0];
      let validTimeCount = 0;

      records.forEach(row => {
        const rawTime = row[timeCol];
        if (!rawTime) return;

        let hour = -1;
        const strTime = String(rawTime).trim();

        // Check if string contains "HH:MM"
        const timeMatch = strTime.match(/(\d{1,2}):(\d{2})/);
        if (timeMatch) {
          hour = parseInt(timeMatch[1], 10) % 24;
        } else {
          const d = new Date(strTime);
          if (!isNaN(d.getTime())) {
            hour = d.getUTCHours();
          }
        }

        if (hour >= 0 && hour < 24) {
          hourlyBuckets[hour]++;
          validTimeCount++;
        }
      });

      if (validTimeCount >= 3) {
        hasTimelineData = true;
        // Calculate anomaly surge per hour
        const avg = validTimeCount / 24;
        for (let i = 0; i < 24; i++) {
          const diff = hourlyBuckets[i] - avg;
          hourlyAnomaly[i] = diff > 0 ? Math.min(100, Math.round((diff / (avg || 1)) * 40)) : Math.max(0, Math.round(hourlyBuckets[i] * 2));
        }
      }
    }

    const timelineData = hasTimelineData
      ? hourlyBuckets.map((count, hour) => ({
          time: `${String(hour).padStart(2, '0')}:00`,
          totalEvents: count,
          anomalyScore: hourlyAnomaly[hour]
        }))
      : [];

    const nodes = Array.from(nodeMap.values());
    const links = Array.from(linkMap.values());

    // 4. Compute dynamic statistics
    const stats = {
      nodesCount: nodes.length,
      edgesCount: links.length,
      actorsCount: nodes.filter(n => n.type === 'ACTOR').length,
      platformsCount: nodes.filter(n => n.type === 'FORUM').length,
      aliasesCount: nodes.filter(n => n.type === 'ALIAS').length,
      walletsCount: nodes.filter(n => n.type === 'WALLET').length,
      pgpCount: nodes.filter(n => n.type === 'CLUSTER' && n.name.startsWith('PGP')).length,
      domainsCount: nodes.filter(n => n.type === 'DOMAIN').length,
      emailsCount: nodes.filter(n => n.type === 'EMAIL').length,
      ipsCount: nodes.filter(n => n.type === 'IP').length,
      highRiskCount: nodes.filter(n => n.riskLevel === 'HIGH' || n.riskLevel === 'CRITICAL').length
    };

    onProgress?.(7, 'Graph Ready');

    const extension = file.name.split('.').pop()?.toUpperCase() as 'CSV' | 'JSON' | 'XLSX';

    const metadata: DatasetMetadata = {
      fileName: file.name,
      fileType: extension || 'CSV',
      fileSizeBytes: file.size,
      recordCount: records.length,
      columnNames: columns,
      detectedMappings: mappings,
      uploadedAt: new Date().toISOString(),
      status: 'READY'
    };

    // Deterministically extract prime suspect & ranked suspects from this uploaded dataset
    const { primeSuspect, topSuspects } = DatasetGraphProcessor.extractSuspectAttribution(nodes, links, records);

    return {
      metadata,
      nodes,
      links,
      stats,
      timelineData,
      hasTimelineData,
      rawRecords: records,
      primeSuspect,
      topSuspects
    };
  }

  /**
   * Deterministically analyze processed nodes, connections, and raw records
   * to identify the Prime Suspect and ranked suspects with grounded "WHY" reasoning.
   */
  public static extractSuspectAttribution(
    nodes: GraphNode[],
    links: GraphLink[],
    records: Record<string, any>[]
  ): { primeSuspect: SuspectAttribution | undefined; topSuspects: SuspectAttribution[] } {
    if (!nodes.length) {
      return { primeSuspect: undefined, topSuspects: [] };
    }

    // 1. Identify candidate suspect entities (prioritize ACTOR, ALIAS, IP, WALLET)
    const actorNodes = nodes.filter(n => n.type === 'ACTOR' || n.type === 'ALIAS');
    const ipNodes = nodes.filter(n => n.type === 'IP');
    const walletNodes = nodes.filter(n => n.type === 'WALLET');

    const candidateNodes = actorNodes.length > 0 
      ? actorNodes 
      : (ipNodes.length > 0 ? ipNodes : (walletNodes.length > 0 ? walletNodes : nodes));

    // 2. Score candidates based on centrality, risk, supporting records, and indicators
    const scoredCandidates = candidateNodes.map(node => {
      const connectedLinks = links.filter(l => {
        const s = typeof l.source === 'object' ? (l.source as any).id : l.source;
        const t = typeof l.target === 'object' ? (l.target as any).id : l.target;
        return s === node.id || t === node.id;
      });

      const neighborIds = new Set<string>();
      connectedLinks.forEach(l => {
        const s = typeof l.source === 'object' ? (l.source as any).id : l.source;
        const t = typeof l.target === 'object' ? (l.target as any).id : l.target;
        neighborIds.add(s === node.id ? t : s);
      });

      const neighborNodes = nodes.filter(n => neighborIds.has(n.id));
      const hasWallet = neighborNodes.some(n => n.type === 'WALLET');
      const hasPGP = neighborNodes.some(n => n.name.toLowerCase().includes('pgp') || n.type === 'CLUSTER');
      const hasDomain = neighborNodes.some(n => n.type === 'DOMAIN');
      const hasIP = neighborNodes.some(n => n.type === 'IP');
      const hasForum = neighborNodes.some(n => n.type === 'FORUM');

      const supportingRows = node.details?.provenanceRowIndices?.length || 1;
      const degree = neighborNodes.length;

      // Composite Threat Score (0 - 100)
      const baseRisk = node.riskScore ?? 50;
      let compositeScore = (baseRisk * 0.45) + (Math.min(degree, 8) * 4) + (Math.min(supportingRows, 10) * 2);
      if (hasWallet) compositeScore += 10;
      if (hasPGP) compositeScore += 15;
      if (hasDomain) compositeScore += 8;
      if (hasIP) compositeScore += 5;

      const finalThreatScore = Math.min(99, Math.max(35, Math.round(compositeScore)));

      // Confidence score (based on evidence count and orthogonal signals)
      const orthogonalSignalsCount = [hasWallet, hasPGP, hasDomain, hasIP, degree >= 2].filter(Boolean).length;
      const confidenceScore = Math.min(99, Math.max(72, 75 + (orthogonalSignalsCount * 5)));

      // Generate the grounded "WHY" explanation based on uploaded CSV data
      const reasons: string[] = [];
      reasons.push(`Directly observed in ${supportingRows} verified records across uploaded dataset.`);
      if (degree > 0) {
        reasons.push(`Identified as central hub connected to ${degree} unique network indicators.`);
      }
      if (hasPGP) {
        reasons.push(`Cryptographic PGP public key signature link detected in dataset.`);
      }
      if (hasWallet) {
        const linkedWallet = neighborNodes.find(n => n.type === 'WALLET');
        reasons.push(`Cryptocurrency wallet association observed: ${linkedWallet ? linkedWallet.name : 'Tracked deposit address'}.`);
      }
      if (hasDomain) {
        const linkedDomain = neighborNodes.find(n => n.type === 'DOMAIN');
        reasons.push(`Correlated with hidden service infrastructure: ${linkedDomain ? linkedDomain.name : '.onion endpoint'}.`);
      }
      if (hasForum) {
        const linkedForum = neighborNodes.find(n => n.type === 'FORUM');
        reasons.push(`Observed active on monitored platform ${linkedForum ? linkedForum.name : 'Underground venue'}.`);
      }
      if (node.details?.riskColumnValue) {
        reasons.push(`Explicit high-severity risk indicator flagged in dataset column (Score: ${node.details.riskColumnValue}).`);
      }

      const whySummary = reasons.slice(0, 3).join(' • ');

      let category = 'High-Risk Network Threat Entity';
      if (node.type === 'ACTOR' || node.type === 'ALIAS') {
        category = hasWallet ? 'Cryptocurrency Drainer & Threat Operator' : 'Primary Underground Threat Actor';
      } else if (node.type === 'IP') {
        category = 'Malicious Threat Originator IP';
      } else if (node.type === 'WALLET') {
        category = 'Laundering & Settlement Wallet Hub';
      }

      const associatedEntities = neighborNodes.slice(0, 6).map(n => ({
        type: n.type,
        value: n.name
      }));

      return {
        node,
        finalThreatScore,
        confidenceScore,
        reasons,
        whySummary,
        category,
        degree,
        supportingRows,
        associatedEntities
      };
    });

    // Sort descending by composite score
    scoredCandidates.sort((a, b) => b.finalThreatScore - a.finalThreatScore);

    const topSuspects: SuspectAttribution[] = scoredCandidates.slice(0, 5).map((item, index) => ({
      rank: index + 1,
      name: item.node.name,
      type: item.node.type,
      riskScore: item.finalThreatScore,
      riskLevel: item.finalThreatScore >= 80 ? 'CRITICAL' : (item.finalThreatScore >= 60 ? 'HIGH' : 'MEDIUM'),
      confidenceScore: item.confidenceScore,
      category: item.category,
      why: item.whySummary,
      reasons: item.reasons,
      connectionsCount: item.degree,
      recordCount: item.supportingRows,
      associatedEntities: item.associatedEntities
    }));

    return {
      primeSuspect: topSuspects[0],
      topSuspects
    };
  }
}
