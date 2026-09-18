// ============================================================
// UNMASK // INTELLIGENCE CSV EXPORTER SERVICE
// Generates & Triggers Browser Downloads for Discovered Telemetry
// ============================================================

import type { SuspectAttribution } from './datasetGraphProcessor';
import type { GraphNode, GraphLink } from '../types/intelligence';

export class IntelligenceExporter {
  /**
   * Helper to escape CSV cell values according to RFC 4180
   */
  public static escapeCell(value: any): string {
    if (value === null || value === undefined) return '""';
    const str = String(value);
    if (str.includes(',') || str.includes('"') || str.includes('\n') || str.includes('\r')) {
      return `"${str.replace(/"/g, '""')}"`;
    }
    return `"${str}"`;
  }

  /**
   * Client-side trigger to download a string as a CSV file with UTF-8 BOM
   */
  public static triggerDownload(csvContent: string, filename: string): void {
    const bom = '\uFEFF';
    const blob = new Blob([bom + csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', filename);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  }

  /**
   * Export the Prime Suspect and Ranked Suspects as a comprehensive CSV report
   */
  public static downloadSuspectAttributionCSV(
    primeSuspect: SuspectAttribution,
    topSuspects: SuspectAttribution[] = [],
    datasetName: string = 'Uploaded_Telemetry'
  ): void {
    const cleanDatasetName = datasetName.replace(/[^a-zA-Z0-9_-]/g, '_');
    const timestamp = new Date().toISOString().replace(/[:.]/g, '-').slice(0, 19);
    const filename = `UNMASK_Suspect_Attribution_${primeSuspect.name}_${timestamp}.csv`;

    const allSuspects = topSuspects.length > 0 ? topSuspects : [primeSuspect];

    const rows: string[] = [];

    const headers = [
      'Rank',
      'Suspect_Alias',
      'Threat_Category',
      'Attribution_Confidence_Pct',
      'Threat_Score_100',
      'Risk_Level',
      'Supporting_Records_Count',
      'Network_Connections_Count',
      'The_Why_Evidence_Summary',
      'Evidence_Signal_1',
      'Evidence_Signal_2',
      'Evidence_Signal_3',
      'Evidence_Signal_4',
      'Linked_Wallets',
      'Linked_PGP_Keys',
      'Linked_Domains',
      'Linked_IPs',
      'Target_Dataset',
      'Report_Timestamp'
    ];

    rows.push(headers.map(h => IntelligenceExporter.escapeCell(h)).join(','));

    allSuspects.forEach(s => {
      const wallets = s.associatedEntities.filter(e => e.type === 'WALLET').map(e => e.value).join('; ') || 'None';
      const pgp = s.associatedEntities.filter(e => e.type.includes('PGP') || e.type === 'CLUSTER').map(e => e.value).join('; ') || 'None';
      const domains = s.associatedEntities.filter(e => e.type === 'DOMAIN').map(e => e.value).join('; ') || 'None';
      const ips = s.associatedEntities.filter(e => e.type === 'IP').map(e => e.value).join('; ') || 'None';

      const sig1 = s.reasons[0] || 'N/A';
      const sig2 = s.reasons[1] || 'N/A';
      const sig3 = s.reasons[2] || 'N/A';
      const sig4 = s.reasons[3] || 'N/A';

      const rowValues = [
        s.rank,
        s.name,
        s.category,
        `${s.confidenceScore}%`,
        s.riskScore,
        s.riskLevel,
        s.recordCount,
        s.connectionsCount,
        s.why,
        sig1,
        sig2,
        sig3,
        sig4,
        wallets,
        pgp,
        domains,
        ips,
        datasetName,
        new Date().toISOString()
      ];

      rows.push(rowValues.map(v => IntelligenceExporter.escapeCell(v)).join(','));
    });

    rows.push('');
    rows.push('# ==============================================================================');
    rows.push('# TABLE 2: PRIME SUSPECT DISCOVERED NETWORK INDICATORS');
    rows.push('# ==============================================================================');

    const indicatorHeaders = ['Indicator_Type', 'Indicator_Value', 'Associated_Suspect', 'Status'];
    rows.push(indicatorHeaders.map(h => IntelligenceExporter.escapeCell(h)).join(','));

    if (primeSuspect.associatedEntities.length > 0) {
      primeSuspect.associatedEntities.forEach(ent => {
        rows.push([
          IntelligenceExporter.escapeCell(ent.type),
          IntelligenceExporter.escapeCell(ent.value),
          IntelligenceExporter.escapeCell(primeSuspect.name),
          IntelligenceExporter.escapeCell('VERIFIED_LINK')
        ].join(','));
      });
    } else {
      rows.push([
        IntelligenceExporter.escapeCell('RECORD_COUNT'),
        IntelligenceExporter.escapeCell(`${primeSuspect.recordCount} verified events in telemetry`),
        IntelligenceExporter.escapeCell(primeSuspect.name),
        IntelligenceExporter.escapeCell('OBSERVED')
      ].join(','));
    }

    const csvContent = rows.join('\r\n');
    IntelligenceExporter.triggerDownload(csvContent, filename);
  }

  /**
   * Export all Discovered Threat Graph Nodes & Indicators as a standalone CSV
   */
  public static downloadDiscoveredIndicatorsCSV(
    nodes: GraphNode[],
    primeSuspectName?: string,
    datasetName: string = 'Intelligence_Matrix'
  ): void {
    const timestamp = new Date().toISOString().replace(/[:.]/g, '-').slice(0, 19);
    const filename = `UNMASK_Discovered_Indicators_${timestamp}.csv`;

    const headers = [
      'Node_ID',
      'Entity_Type',
      'Entity_Label',
      'Risk_Level',
      'Risk_Score',
      'Degree_Connections',
      'Is_Prime_Suspect',
      'Supporting_Rows_Count',
      'Primary_Category'
    ];

    const rows: string[] = [];
    rows.push(headers.map(h => IntelligenceExporter.escapeCell(h)).join(','));

    nodes.forEach(node => {
      const isPrime = primeSuspectName && node.name.toLowerCase() === primeSuspectName.toLowerCase();
      const rowValues = [
        node.id,
        node.type,
        node.name || node.label,
        node.riskLevel || 'MEDIUM',
        node.riskScore ?? 50,
        node.connectionsCount || 0,
        isPrime ? 'YES' : 'NO',
        node.details?.provenanceRowIndices?.length || 1,
        node.details?.category || node.type
      ];
      rows.push(rowValues.map(v => IntelligenceExporter.escapeCell(v)).join(','));
    });

    IntelligenceExporter.triggerDownload(rows.join('\r\n'), filename);
  }

  /**
   * Export Complete Graph Network: Nodes and Links
   */
  public static downloadCompleteIntelligenceGraphCSV(
    nodes: GraphNode[],
    links: GraphLink[],
    suspect?: SuspectAttribution,
    datasetName: string = 'Network_Graph'
  ): void {
    const timestamp = new Date().toISOString().replace(/[:.]/g, '-').slice(0, 19);
    const filename = `UNMASK_Full_Threat_Matrix_${timestamp}.csv`;

    const rows: string[] = [];
    rows.push('# UNMASK INTELLIGENCE MATRIX // DISCOVERED GRAPH NODES & CONNECTIONS');
    rows.push(`# Exported: ${new Date().toISOString()}`);
    if (suspect) {
      rows.push(`# Prime Suspect: ${suspect.name} (${suspect.confidenceScore}% confidence, ${suspect.riskScore}/100 threat score)`);
    }
    rows.push('');

    rows.push('# --- SECTION 1: DISCOVERED NETWORK ENTITIES ---');
    rows.push([
      'Entity_ID',
      'Entity_Type',
      'Label_or_Name',
      'Risk_Level',
      'Risk_Score',
      'Connected_Links_Count'
    ].map(h => IntelligenceExporter.escapeCell(h)).join(','));

    nodes.forEach(n => {
      rows.push([
        IntelligenceExporter.escapeCell(n.id),
        IntelligenceExporter.escapeCell(n.type),
        IntelligenceExporter.escapeCell(n.name || n.label),
        IntelligenceExporter.escapeCell(n.riskLevel || 'MEDIUM'),
        IntelligenceExporter.escapeCell(n.riskScore ?? 50),
        IntelligenceExporter.escapeCell(n.connectionsCount || 0)
      ].join(','));
    });

    rows.push('');
    rows.push('# --- SECTION 2: DISCOVERED TOPOLOGICAL RELATIONSHIPS ---');
    rows.push([
      'Relationship_ID',
      'Source_Entity',
      'Target_Entity',
      'Relationship_Type',
      'Confidence_Percent'
    ].map(h => IntelligenceExporter.escapeCell(h)).join(','));

    links.forEach(l => {
      const sourceId = typeof l.source === 'object' ? (l.source as any).name || (l.source as any).id : l.source;
      const targetId = typeof l.target === 'object' ? (l.target as any).name || (l.target as any).id : l.target;
      rows.push([
        IntelligenceExporter.escapeCell(l.id),
        IntelligenceExporter.escapeCell(sourceId),
        IntelligenceExporter.escapeCell(targetId),
        IntelligenceExporter.escapeCell(l.relationship || (l as any).type || 'CONNECTED_TO'),
        IntelligenceExporter.escapeCell(l.confidence ? `${l.confidence}%` : '85%')
      ].join(','));
    });

    IntelligenceExporter.triggerDownload(rows.join('\r\n'), filename);
  }
}
