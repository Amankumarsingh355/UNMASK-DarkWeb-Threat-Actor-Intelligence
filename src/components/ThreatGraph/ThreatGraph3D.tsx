// ============================================================
// DARKTRACE 3D THREAT GRAPH ENGINE (WebGL / Three.js)
// Immersive 3D Force-Directed Cyber Intelligence Network
// ============================================================

import React, { useEffect, useRef, useState, useMemo } from 'react';
import * as THREE from 'three';
import type { GraphNode, GraphLink, EntityType } from '../../types/intelligence';
import { 
  Maximize2, 
  RotateCcw, 
  Eye, 
  Filter, 
  Layers, 
  Crosshair, 
  Sliders, 
  Sparkles, 
  Info, 
  ChevronRight,
  Upload,
  Database,
  Search,
  X
} from 'lucide-react';
import { useDataset } from '../../context/DatasetContext';

interface ThreatGraph3DProps {
  nodes: GraphNode[];
  links: GraphLink[];
  selectedNodeId: string | null;
  selectedLinkId: string | null;
  onSelectNode: (node: GraphNode | null) => void;
  onSelectLink: (link: GraphLink | null) => void;
  onPivotStep?: (node: GraphNode) => void;
  focusedActorName?: string | null;
  hideTopControls?: boolean;
}

export const ThreatGraph3D: React.FC<ThreatGraph3DProps> = ({
  nodes: initialNodes,
  links: initialLinks,
  selectedNodeId,
  selectedLinkId,
  onSelectNode,
  onSelectLink,
  onPivotStep,
  focusedActorName,
  hideTopControls = false
}) => {
  const { mode, metadata, openUploadModal, resetToDemo } = useDataset();
  const containerRef = useRef<HTMLDivElement>(null);
  const [minConfidence, setMinConfidence] = useState<number>(0);
  const [activeTypeFilters, setActiveTypeFilters] = useState<Record<EntityType, boolean>>({
    ACTOR: true,
    ALIAS: true,
    EMAIL: true,
    DOMAIN: true,
    IP: true,
    WALLET: true,
    TRANSACTION: true,
    FORUM: true,
    POST: true,
    CLUSTER: true,
    EVENT: true
  });
  const [layoutMode, setLayoutMode] = useState<'3D_FORCE' | 'CONCENTRIC' | 'SPATIAL'>('3D_FORCE');
  const [hoveredNode, setHoveredNode] = useState<GraphNode | null>(null);
  const [tooltipPos, setTooltipPos] = useState<{ x: number; y: number }>({ x: 24, y: 24 });
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [is3DMode, setIs3DMode] = useState(true);

  // Simulation node positions & 3D state refs
  const sceneRef = useRef<THREE.Scene | null>(null);
  const cameraRef = useRef<THREE.PerspectiveCamera | null>(null);
  const rendererRef = useRef<THREE.WebGLRenderer | null>(null);
  const nodesMeshMap = useRef<Map<string, THREE.Object3D>>(new Map());
  const linksLineMap = useRef<Map<string, THREE.LineSegments | THREE.Line>>(new Map());
  const particlesRef = useRef<THREE.Points | null>(null);
  const animationFrameId = useRef<number | null>(null);
  const isDragging = useRef(false);
  const prevMousePos = useRef({ x: 0, y: 0 });
  const cameraRotation = useRef({ theta: 0.3, phi: 0.4, radius: 420 });
  const cameraTarget = useRef<THREE.Vector3>(new THREE.Vector3(0, 0, 0));

  // Compute filtered dataset
  const filteredNodes = useMemo(() => {
    return initialNodes.filter(n => activeTypeFilters[n.type]);
  }, [initialNodes, activeTypeFilters]);

  const filteredLinks = useMemo(() => {
    const nodeIds = new Set(filteredNodes.map(n => n.id));
    return initialLinks.filter(l => {
      const srcId = typeof l.source === 'object' ? (l.source as any).id : l.source;
      const tgtId = typeof l.target === 'object' ? (l.target as any).id : l.target;
      return nodeIds.has(srcId) && nodeIds.has(tgtId) && l.confidence >= minConfidence;
    });
  }, [initialLinks, filteredNodes, minConfidence]);

  // Set of neighboring node IDs for dimming logic
  const connectedNodeIds = useMemo(() => {
    if (!selectedNodeId) return null;
    const set = new Set<string>([selectedNodeId]);
    filteredLinks.forEach(l => {
      const srcId = typeof l.source === 'object' ? (l.source as any).id : l.source;
      const tgtId = typeof l.target === 'object' ? (l.target as any).id : l.target;
      if (srcId === selectedNodeId) set.add(tgtId);
      if (tgtId === selectedNodeId) set.add(srcId);
    });
    return set;
  }, [selectedNodeId, filteredLinks]);

  // Setup Three.js Scene
  useEffect(() => {
    if (!containerRef.current) return;
    const container = containerRef.current;
    const width = container.clientWidth || 800;
    const height = container.clientHeight || 500;

    const scene = new THREE.Scene();
    sceneRef.current = scene;

    const camera = new THREE.PerspectiveCamera(50, width / height, 1, 3000);
    camera.position.set(0, 80, 420);
    camera.lookAt(0, 0, 0);
    cameraRef.current = camera;

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setClearColor(0x000000, 0);
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    rendererRef.current = renderer;

    container.replaceChildren(renderer.domElement);

    // Ambient & Point Lighting
    const ambientLight = new THREE.AmbientLight(0x0e2238, 2.5);
    scene.add(ambientLight);

    const cyanPoint = new THREE.PointLight(0x00f0ff, 3.5, 800);
    cyanPoint.position.set(150, 180, 150);
    scene.add(cyanPoint);

    const violetPoint = new THREE.PointLight(0xa855f7, 3, 800);
    violetPoint.position.set(-180, -120, -100);
    scene.add(violetPoint);

    // Background particle dust
    const particleCount = 450;
    const pGeo = new THREE.BufferGeometry();
    const pPos = new Float32Array(particleCount * 3);
    for (let i = 0; i < particleCount * 3; i += 3) {
      pPos[i] = (Math.random() - 0.5) * 1200;
      pPos[i + 1] = (Math.random() - 0.5) * 1200;
      pPos[i + 2] = (Math.random() - 0.5) * 1200;
    }
    pGeo.setAttribute('position', new THREE.BufferAttribute(pPos, 3));
    const pMat = new THREE.PointsMaterial({
      color: 0x38bdf8,
      size: 2.2,
      transparent: true,
      opacity: 0.35,
      blending: THREE.AdditiveBlending
    });
    const particles = new THREE.Points(pGeo, pMat);
    scene.add(particles);
    particlesRef.current = particles;

    // Handle Resize
    const handleResize = () => {
      if (!containerRef.current || !rendererRef.current || !cameraRef.current) return;
      const w = containerRef.current.clientWidth;
      const h = containerRef.current.clientHeight;
      cameraRef.current.aspect = w / h;
      cameraRef.current.updateProjectionMatrix();
      rendererRef.current.setSize(w, h);
    };
    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
      if (animationFrameId.current) cancelAnimationFrame(animationFrameId.current);
      renderer.dispose();
    };
  }, []);

  // Update Geometry and Node Meshes
  useEffect(() => {
    const scene = sceneRef.current;
    if (!scene) return;

    // Clear old node meshes and links
    nodesMeshMap.current.forEach(mesh => scene.remove(mesh));
    nodesMeshMap.current.clear();
    linksLineMap.current.forEach(line => scene.remove(line));
    linksLineMap.current.clear();

    // Map of calculated node coordinates
    const coordsMap = new Map<string, { x: number; y: number; z: number }>();
    const nodeCount = filteredNodes.length;

    // Layout algorithms
    filteredNodes.forEach((node, idx) => {
      let x = 0, y = 0, z = 0;

      if (layoutMode === 'CONCENTRIC') {
        // Rings based on entity types
        const typeRadius: Record<EntityType, number> = {
          ACTOR: 40,
          ALIAS: 95,
          EMAIL: 140,
          WALLET: 185,
          TRANSACTION: 220,
          DOMAIN: 170,
          IP: 210,
          FORUM: 250,
          POST: 270,
          CLUSTER: 120,
          EVENT: 160
        };
        const r = typeRadius[node.type] || 150;
        const angle = (idx / nodeCount) * Math.PI * 2 * 3;
        x = Math.cos(angle) * r;
        z = Math.sin(angle) * r;
        y = ((idx % 5) - 2) * 25;
      } else if (layoutMode === 'SPATIAL') {
        // Cluster by risk level
        const riskX: Record<string, number> = {
          CRITICAL: 140,
          HIGH: 50,
          MEDIUM: -60,
          LOW: -150
        };
        x = (riskX[node.riskLevel || 'LOW'] || 0) + (Math.random() - 0.5) * 60;
        y = (idx % 8 - 4) * 35;
        z = (Math.random() - 0.5) * 140;
      } else {
        // 3D Spherical Force
        const phi = Math.acos(-1 + (2 * idx) / nodeCount);
        const theta = Math.sqrt(nodeCount * Math.PI) * phi;
        const radius = node.type === 'ACTOR' ? 80 : 160 + (idx % 3) * 30;
        x = radius * Math.cos(theta) * Math.sin(phi);
        y = radius * Math.sin(theta) * Math.sin(phi);
        z = radius * Math.cos(phi);
      }

      coordsMap.set(node.id, { x, y, z });

      // Create Custom 3D Mesh by Entity Type
      const group = new THREE.Group();
      group.position.set(x, y, z);
      (group as any).__nodeData = node;

      const isConnected = !connectedNodeIds || connectedNodeIds.has(node.id);
      const isCurrentSelected = node.id === selectedNodeId;
      const baseOpacity = isConnected ? 1.0 : 0.18;

      let meshColor = node.color ? parseInt(node.color.replace('#', '0x'), 16) : 0x00f0ff;
      if (node.type === 'ACTOR') {
        meshColor = node.riskLevel === 'CRITICAL' ? 0xef4444 : 0x00f0ff;
      }

      // Helper for clean 3D text badge sprite
      const createNodeLabelSprite = (text: string, textColor: string = '#ffffff', borderColor: string = 'rgba(6, 182, 212, 0.4)') => {
        const canvas = document.createElement('canvas');
        canvas.width = 256;
        canvas.height = 64;
        const ctx = canvas.getContext('2d');
        if (ctx) {
          ctx.fillStyle = 'rgba(8, 12, 22, 0.85)';
          if (ctx.roundRect) {
            ctx.roundRect(8, 10, 240, 44, 8);
          } else {
            ctx.rect(8, 10, 240, 44);
          }
          ctx.fill();
          ctx.strokeStyle = borderColor;
          ctx.lineWidth = 2;
          ctx.stroke();

          ctx.font = 'bold 20px "Segoe UI", Inter, sans-serif';
          ctx.fillStyle = textColor;
          ctx.textAlign = 'center';
          ctx.textBaseline = 'middle';
          ctx.fillText(text.length > 16 ? text.slice(0, 15) + '..' : text, 128, 32);
        }
        const texture = new THREE.CanvasTexture(canvas);
        const spriteMat = new THREE.SpriteMaterial({ map: texture, transparent: true, depthTest: false });
        const sprite = new THREE.Sprite(spriteMat);
        sprite.scale.set(38, 9.5, 1);
        sprite.position.set(0, 16, 0);
        return sprite;
      };

      // Geometries for specific entity classes
      if (node.type === 'ACTOR') {
        const geo = new THREE.SphereGeometry(node.size ? node.size * 0.45 : 9, 24, 24);
        const mat = new THREE.MeshStandardMaterial({
          color: meshColor,
          emissive: meshColor,
          emissiveIntensity: isCurrentSelected ? 0.9 : 0.4,
          roughness: 0.2,
          metalness: 0.8,
          transparent: true,
          opacity: baseOpacity
        });
        const sphere = new THREE.Mesh(geo, mat);
        group.add(sphere);

        // Orbital ring around actor
        const ringGeo = new THREE.RingGeometry(14, 16, 32);
        const ringMat = new THREE.MeshBasicMaterial({
          color: meshColor,
          side: THREE.DoubleSide,
          transparent: true,
          opacity: isCurrentSelected ? 0.85 : 0.45
        });
        const ring = new THREE.Mesh(ringGeo, ringMat);
        ring.rotation.x = Math.PI / 2;
        group.add(ring);

        // Add 3D Text Label
        const label = createNodeLabelSprite(node.name, '#ffffff', 'rgba(6, 182, 212, 0.6)');
        group.add(label);
      } else if (node.type === 'WALLET') {
        // Hexagonal prism
        const geo = new THREE.CylinderGeometry(7, 7, 6, 6);
        const mat = new THREE.MeshStandardMaterial({
          color: 0xf59e0b,
          emissive: 0xf59e0b,
          emissiveIntensity: 0.4,
          metalness: 0.9,
          roughness: 0.3,
          transparent: true,
          opacity: baseOpacity
        });
        const hex = new THREE.Mesh(geo, mat);
        group.add(hex);

        if (idx % 2 === 0 || isCurrentSelected) {
          const label = createNodeLabelSprite(node.name, '#fcd34d', 'rgba(245, 158, 11, 0.5)');
          group.add(label);
        }
      } else if (node.type === 'DOMAIN') {
        // Faceted Cube
        const geo = new THREE.BoxGeometry(9, 9, 9);
        const mat = new THREE.MeshStandardMaterial({
          color: 0x10b981,
          emissive: 0x10b981,
          emissiveIntensity: 0.35,
          transparent: true,
          opacity: baseOpacity
        });
        const cube = new THREE.Mesh(geo, mat);
        group.add(cube);

        if (node.name.includes('onion') || isCurrentSelected) {
          const label = createNodeLabelSprite(node.name, '#6ee7b7', 'rgba(16, 185, 129, 0.5)');
          group.add(label);
        }
      } else if (node.type === 'IP') {
        // Tall cylinder beacon
        const geo = new THREE.CylinderGeometry(4, 4, 14, 16);
        const mat = new THREE.MeshStandardMaterial({
          color: 0x06b6d4,
          emissive: 0x06b6d4,
          emissiveIntensity: 0.4,
          transparent: true,
          opacity: baseOpacity
        });
        const cyl = new THREE.Mesh(geo, mat);
        group.add(cyl);
      } else if (node.type === 'TRANSACTION') {
        // Diamond / Octahedron
        const geo = new THREE.OctahedronGeometry(6);
        const mat = new THREE.MeshStandardMaterial({
          color: 0xf97316,
          emissive: 0xf97316,
          emissiveIntensity: 0.5,
          transparent: true,
          opacity: baseOpacity
        });
        const diamond = new THREE.Mesh(geo, mat);
        group.add(diamond);
      } else if (node.type === 'FORUM') {
        // Red pedestal disc
        const geo = new THREE.CylinderGeometry(10, 11, 4, 24);
        const mat = new THREE.MeshStandardMaterial({
          color: 0xe11d48,
          emissive: 0xe11d48,
          emissiveIntensity: 0.45,
          transparent: true,
          opacity: baseOpacity
        });
        const forum = new THREE.Mesh(geo, mat);
        group.add(forum);

        const label = createNodeLabelSprite(node.name, '#fda4af', 'rgba(225, 29, 72, 0.5)');
        group.add(label);
      } else {
        // Alias / Email / Event nodes
        const geo = new THREE.SphereGeometry(node.size ? node.size * 0.35 : 5, 16, 16);
        const mat = new THREE.MeshStandardMaterial({
          color: meshColor,
          emissive: meshColor,
          emissiveIntensity: 0.3,
          transparent: true,
          opacity: baseOpacity
        });
        const sphere = new THREE.Mesh(geo, mat);
        group.add(sphere);

        if (node.type === 'ALIAS' || isCurrentSelected) {
          const label = createNodeLabelSprite(node.name, '#93c5fd', 'rgba(59, 130, 246, 0.5)');
          group.add(label);
        }
      }

      scene.add(group);
      nodesMeshMap.current.set(node.id, group);
    });

    // Create 3D Edge Lines
    filteredLinks.forEach(link => {
      const srcId = typeof link.source === 'object' ? (link.source as any).id : link.source;
      const tgtId = typeof link.target === 'object' ? (link.target as any).id : link.target;

      const p1 = coordsMap.get(srcId);
      const p2 = coordsMap.get(tgtId);
      if (!p1 || !p2) return;

      const points = [
        new THREE.Vector3(p1.x, p1.y, p1.z),
        new THREE.Vector3(p2.x, p2.y, p2.z)
      ];

      const lineGeo = new THREE.BufferGeometry().setFromPoints(points);

      const isConnectedEdge = selectedNodeId && (srcId === selectedNodeId || tgtId === selectedNodeId);
      const isSelectedEdge = selectedLinkId === link.id;

      let lineColor = 0x06b6d4; // Default High Confidence Cyan
      if (link.confidence >= 90) lineColor = 0x10b981; // Very High Confidence Emerald
      else if (link.confidence >= 75) lineColor = 0x06b6d4; // High Confidence Cyan
      else if (link.confidence >= 50) lineColor = 0xf59e0b; // Moderate Confidence Amber
      else lineColor = 0xf43f5e; // Low Confidence Rose

      if (link.relationship === 'POTENTIAL_CORRELATION') lineColor = 0xa855f7;
      if (isSelectedEdge) lineColor = 0x00f0ff;

      const baseOpacity = link.confidence >= 90 ? 0.85 : link.confidence >= 75 ? 0.65 : 0.40;

      const lineMat = new THREE.LineBasicMaterial({
        color: isSelectedEdge ? 0x00f0ff : lineColor,
        transparent: true,
        opacity: isSelectedEdge ? 1.0 : (isConnectedEdge ? 0.95 : (selectedNodeId ? 0.12 : baseOpacity)),
        linewidth: isSelectedEdge ? 3 : (link.confidence >= 90 ? 2 : 1)
      });


      const line = new THREE.Line(lineGeo, lineMat);
      (line as any).__linkData = link;
      scene.add(line);
      linksLineMap.current.set(link.id, line);
    });

  }, [filteredNodes, filteredLinks, layoutMode, selectedNodeId, selectedLinkId, connectedNodeIds]);

  // Focus Camera on specific actor if requested
  useEffect(() => {
    if (!focusedActorName) return;
    const targetNode = filteredNodes.find(n => n.name.toLowerCase() === focusedActorName.toLowerCase());
    if (targetNode && nodesMeshMap.current.has(targetNode.id)) {
      const mesh = nodesMeshMap.current.get(targetNode.id);
      if (mesh) {
        cameraTarget.current.copy(mesh.position);
        cameraRotation.current.radius = 180;
        onSelectNode(targetNode);
      }
    }
  }, [focusedActorName, filteredNodes, onSelectNode]);

  // Render & Animation Loop
  useEffect(() => {
    let frame = 0;
    const animate = () => {
      frame++;
      animationFrameId.current = requestAnimationFrame(animate);

      if (particlesRef.current) {
        particlesRef.current.rotation.y += 0.0006;
      }

      // Smooth camera position calculation
      if (cameraRef.current) {
        const { theta, phi, radius } = cameraRotation.current;
        const x = cameraTarget.current.x + radius * Math.sin(phi) * Math.sin(theta);
        const y = cameraTarget.current.y + radius * Math.cos(phi);
        const z = cameraTarget.current.z + radius * Math.sin(phi) * Math.cos(theta);

        cameraRef.current.position.lerp(new THREE.Vector3(x, y, z), 0.08);
        cameraRef.current.lookAt(cameraTarget.current);
      }

      // Pulse animation for high confidence/selected links
      nodesMeshMap.current.forEach((mesh, id) => {
        const data = (mesh as any).__nodeData as GraphNode;
        if (data?.type === 'ACTOR') {
          mesh.rotation.y += 0.01;
        }
      });

      if (rendererRef.current && sceneRef.current && cameraRef.current) {
        rendererRef.current.render(sceneRef.current, cameraRef.current);
      }
    };

    animate();

    return () => {
      if (animationFrameId.current) cancelAnimationFrame(animationFrameId.current);
    };
  }, []);

  // Mouse Orbit / Pan / Click Handler
  const handleMouseDown = (e: React.MouseEvent) => {
    isDragging.current = true;
    prevMousePos.current = { x: e.clientX, y: e.clientY };
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!containerRef.current || !cameraRef.current || !sceneRef.current) return;

    if (isDragging.current) {
      const dx = e.clientX - prevMousePos.current.x;
      const dy = e.clientY - prevMousePos.current.y;
      prevMousePos.current = { x: e.clientX, y: e.clientY };

      cameraRotation.current.theta -= dx * 0.006;
      cameraRotation.current.phi = Math.max(0.1, Math.min(Math.PI - 0.1, cameraRotation.current.phi - dy * 0.006));
    } else {
      // Raycasting for hover tooltip
      const rect = containerRef.current.getBoundingClientRect();
      const mouse = new THREE.Vector2(
        ((e.clientX - rect.left) / rect.width) * 2 - 1,
        -((e.clientY - rect.top) / rect.height) * 2 + 1
      );

      const raycaster = new THREE.Raycaster();
      raycaster.setFromCamera(mouse, cameraRef.current);

      const interactiveMeshes: THREE.Object3D[] = [];
      nodesMeshMap.current.forEach(g => {
        g.children.forEach(c => interactiveMeshes.push(c));
      });

      const intersects = raycaster.intersectObjects(interactiveMeshes, false);
      if (intersects.length > 0) {
        const parent = intersects[0].object.parent;
        const nodeData = (parent as any)?.__nodeData as GraphNode;
        if (nodeData) {
          const mouseX = e.clientX - rect.left;
          const mouseY = e.clientY - rect.top;
          // Clamp so tooltip never clips outside or overlaps bottom edges
          const tooltipWidth = 240;
          const tooltipHeight = 110;
          const clampedX = mouseX + 16 + tooltipWidth > rect.width 
            ? Math.max(12, mouseX - tooltipWidth - 12) 
            : mouseX + 16;
          const clampedY = mouseY + 16 + tooltipHeight > rect.height 
            ? Math.max(12, mouseY - tooltipHeight - 12) 
            : mouseY + 16;
          
          setTooltipPos({ x: clampedX, y: clampedY });
          setHoveredNode(nodeData);
          containerRef.current.style.cursor = 'pointer';
          return;
        }
      }
      setHoveredNode(null);
      containerRef.current.style.cursor = 'grab';
    }
  };

  const handleMouseUp = () => {
    isDragging.current = false;
  };

  const handleWheel = (e: React.WheelEvent) => {
    e.preventDefault();
    cameraRotation.current.radius = Math.max(80, Math.min(850, cameraRotation.current.radius + e.deltaY * 0.35));
  };

  const handleClick = (e: React.MouseEvent) => {
    if (!containerRef.current || !cameraRef.current || !sceneRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const mouse = new THREE.Vector2(
      ((e.clientX - rect.left) / rect.width) * 2 - 1,
      -((e.clientY - rect.top) / rect.height) * 2 + 1
    );

    const raycaster = new THREE.Raycaster();
    raycaster.setFromCamera(mouse, cameraRef.current);

    // Check node intersections
    const interactiveMeshes: THREE.Object3D[] = [];
    nodesMeshMap.current.forEach(g => {
      g.children.forEach(c => interactiveMeshes.push(c));
    });

    const intersects = raycaster.intersectObjects(interactiveMeshes, false);
    if (intersects.length > 0) {
      const parent = intersects[0].object.parent;
      const nodeData = (parent as any)?.__nodeData as GraphNode;
      if (nodeData) {
        onSelectNode(nodeData);
        onSelectLink(null);
        if (onPivotStep) onPivotStep(nodeData);
        return;
      }
    }

    // Check link line intersections
    const linkLines = Array.from(linksLineMap.current.values());
    const lineIntersects = raycaster.intersectObjects(linkLines, false);
    if (lineIntersects.length > 0) {
      const linkData = (lineIntersects[0].object as any)?.__linkData as GraphLink;
      if (linkData) {
        onSelectLink(linkData);
        onSelectNode(null);
        return;
      }
    }

    // Clicked empty space
    onSelectNode(null);
    onSelectLink(null);
  };

  const [searchQuery, setSearchQuery] = useState<string>('');
  const [isSearchDropdownOpen, setIsSearchDropdownOpen] = useState<boolean>(false);
  const searchContainerRef = useRef<HTMLDivElement>(null);

  // Close search dropdown on click outside
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (searchContainerRef.current && !searchContainerRef.current.contains(e.target as Node)) {
        setIsSearchDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Matching node suggestions
  const matchingNodes = useMemo(() => {
    if (!searchQuery.trim()) return [];
    const q = searchQuery.toLowerCase().trim();
    return filteredNodes.filter(n =>
      n.name.toLowerCase().includes(q) ||
      n.id.toLowerCase().includes(q) ||
      (n.type && n.type.toLowerCase().includes(q)) ||
      (n.details?.fullAddress && n.details.fullAddress.toLowerCase().includes(q)) ||
      (n.details?.pgp && n.details.pgp.toLowerCase().includes(q))
    ).slice(0, 8);
  }, [searchQuery, filteredNodes]);

  const resetCamera = () => {
    cameraTarget.current.set(0, 0, 0);
    cameraRotation.current = { theta: 0.3, phi: 0.4, radius: 420 };
  };

  // Focus and orbit 3D camera to target node
  const focusOn3DNode = (node: GraphNode) => {
    const meshGroup = nodesMeshMap.current.get(node.id);
    if (meshGroup) {
      cameraTarget.current.copy(meshGroup.position);
      cameraRotation.current.radius = 200;
    }
    onSelectNode(node);
    onSelectLink(null);
    if (onPivotStep) onPivotStep(node);
    setIsSearchDropdownOpen(false);
  };

  const handleSearchSubmit = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (matchingNodes.length > 0) {
      focusOn3DNode(matchingNodes[0]);
    } else if (searchQuery.trim()) {
      const direct = filteredNodes.find(n => 
        n.name.toLowerCase() === searchQuery.trim().toLowerCase() ||
        n.id.toLowerCase() === searchQuery.trim().toLowerCase()
      );
      if (direct) focusOn3DNode(direct);
    }
  };

  const toggleTypeFilter = (type: EntityType) => {
    setActiveTypeFilters(prev => ({ ...prev, [type]: !prev[type] }));
  };

  return (
    <div className="relative w-full h-full min-h-[560px] bg-transparent rounded-xl overflow-hidden select-none flex flex-col">
      {/* Tactical HUD Header Controls (Hidden when embedded in CommandCenter) */}
      {!hideTopControls && (
        <div className="absolute top-4 left-4 z-20 flex flex-wrap items-center gap-2 bg-[#020713]/40 backdrop-blur-md px-3 py-2 rounded-lg border border-[#1e90ff]/30 text-xs font-mono-code text-cyan-300 shadow-lg">
          <div className="flex items-center space-x-2">
            <span className="flex h-2 w-2 relative">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-cyan-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-cyan-500"></span>
            </span>
            <span className="font-bold tracking-wider text-slate-200">3D THREAT GRAPH</span>
          </div>
          <span className="text-slate-500">|</span>
          <span className="text-cyan-400 font-bold">{filteredNodes.length} NODES</span>
          <span className="text-slate-500">•</span>
          <span className="text-purple-400 font-bold">{filteredLinks.length} EDGES</span>
          <span className="text-slate-500">|</span>

          {/* Demo vs Live Dataset Mode Badge */}
          {mode === 'LIVE' ? (
            <div className="flex items-center space-x-1.5">
              <span className="px-2 py-0.5 rounded bg-emerald-950/80 text-emerald-300 border border-emerald-500/40 text-[10px] font-bold flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
                LIVE DATASET ({metadata?.fileName || 'Active'})
              </span>
              <button
                onClick={resetToDemo}
                className="text-[10px] text-slate-400 hover:text-amber-300 underline font-mono-code transition-colors cursor-pointer"
                title="Revert to Demo Dataset"
              >
                Reset to Demo
              </button>
            </div>
          ) : (
            <span className="px-2 py-0.5 rounded bg-blue-950/80 text-blue-300 border border-blue-500/40 text-[10px] font-bold">
              ● DEMO DATA
            </span>
          )}
        </div>
      )}

      {/* Search Bar Overlay (Always accessible on 3D Graph) */}
      <div className="absolute top-4 right-4 z-20 flex flex-wrap items-center gap-2">
        {/* Node Search Bar & Button */}
        <div ref={searchContainerRef} className="relative">
          <form onSubmit={handleSearchSubmit} className="flex items-center space-x-1">
            <div className="relative">
              <Search className="w-3.5 h-3.5 absolute left-2.5 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => {
                  setSearchQuery(e.target.value);
                  setIsSearchDropdownOpen(true);
                }}
                onFocus={() => setIsSearchDropdownOpen(true)}
                placeholder="Search 3D nodes..."
                className="w-44 sm:w-56 pl-8 pr-7 py-1.5 bg-[#020713]/70 backdrop-blur-md border border-[#1e3a6a] focus:border-[#1e90ff] rounded-lg text-[11px] text-white placeholder-slate-500 focus:outline-none focus:shadow-[0_0_10px_rgba(30,144,255,0.4)] transition-all font-mono-code"
              />
              {searchQuery && (
                <button
                  type="button"
                  onClick={() => {
                    setSearchQuery('');
                    setIsSearchDropdownOpen(false);
                  }}
                  className="absolute right-2 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white p-0.5 rounded cursor-pointer"
                  title="Clear search"
                >
                  <X className="w-3 h-3" />
                </button>
              )}
            </div>

            {/* Explicit Search Button */}
            <button
              type="submit"
              className="px-2.5 py-1.5 hud-button-primary text-white text-[11px] font-bold rounded-lg flex items-center space-x-1 transition-all shadow-sm cursor-pointer hover:shadow-[0_0_10px_rgba(30,144,255,0.5)] font-mono-code"
              title="Search and Focus on 3D Node"
            >
              <Search className="w-3 h-3" />
              <span>Search</span>
            </button>
          </form>

          {/* Interactive Search Autocomplete Dropdown */}
          {isSearchDropdownOpen && searchQuery.trim() && (
            <div className="absolute top-full right-0 mt-1.5 w-72 sm:w-80 max-h-64 overflow-y-auto rounded-xl bg-[#030a1a]/95 backdrop-blur-xl border border-[#1e90ff]/40 shadow-2xl z-50 p-1.5 space-y-1 text-xs font-mono-code">
              <div className="px-2 py-1 text-[10px] text-slate-400 uppercase font-bold border-b border-[#1e90ff]/20 flex justify-between items-center">
                <span>Matching 3D Entities ({matchingNodes.length})</span>
                <span className="text-cyan-400 text-[9px]">Click to Focus</span>
              </div>

              {matchingNodes.length === 0 ? (
                <div className="p-3 text-center text-slate-400 text-[11px] italic">
                  No matching 3D nodes for "{searchQuery}"
                </div>
              ) : (
                matchingNodes.map((node) => {
                  const isSelected = selectedNodeId === node.id;
                  return (
                    <button
                      key={node.id}
                      type="button"
                      onClick={() => focusOn3DNode(node)}
                      className={`w-full text-left p-2 rounded-lg flex items-center justify-between transition-all cursor-pointer ${
                        isSelected
                          ? 'bg-[#1e90ff]/30 text-white border border-[#1e90ff]/50'
                          : 'hover:bg-[#1e90ff]/15 text-slate-200 border border-transparent'
                      }`}
                    >
                      <div className="flex items-center space-x-2 truncate">
                        <div className={`p-1 rounded text-[10px] font-bold shrink-0 ${
                          node.type === 'ACTOR' ? 'bg-purple-500/20 text-purple-300 border border-purple-500/40' :
                          node.type === 'WALLET' ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40' :
                          node.type === 'FORUM' || node.type === 'DOMAIN' ? 'bg-rose-500/20 text-rose-300 border border-rose-500/40' :
                          'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40'
                        }`}>
                          {node.type}
                        </div>
                        <div className="truncate">
                          <span className="font-bold text-xs text-white block truncate">{node.name}</span>
                          <span className="text-[10px] text-slate-400 block truncate font-sans">
                            {node.details?.fullAddress || node.details?.pgp || node.details?.bio || node.id}
                          </span>
                        </div>
                      </div>

                      <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded shrink-0 ml-2 ${
                        (node.riskScore || 50) >= 80 ? 'bg-rose-950/80 text-rose-300 border border-rose-500/40' :
                        (node.riskScore || 50) >= 60 ? 'bg-amber-950/80 text-amber-300 border border-amber-500/40' :
                        'bg-cyan-950/80 text-cyan-300 border border-cyan-500/40'
                      }`}>
                        {node.riskScore || 50}
                      </span>
                    </button>
                  );
                })
              )}
            </div>
          )}
        </div>

        {/* Viewport Control Bar (When full controls enabled) */}
        {!hideTopControls && (
          <>
            {/* Prominent Upload Dataset Button */}
            <button
              onClick={openUploadModal}
              className="px-3 py-1.5 hud-button-primary text-white rounded-lg text-xs font-mono-code font-bold flex items-center space-x-2 transition-all shadow-[0_0_15px_rgba(30,144,255,0.4)] group cursor-pointer"
            >
              <Upload className="w-3.5 h-3.5 group-hover:-translate-y-0.5 transition-transform" />
              <div className="flex flex-col text-left leading-none">
                <span className="font-bold text-[11px] text-white">Upload Dataset</span>
                <span className="text-[8px] text-blue-200 font-normal">CSV / JSON / XLSX</span>
              </div>
            </button>

            {/* Layout Switcher */}
            <div className="flex bg-[#020713]/40 backdrop-blur-md p-1 rounded-lg border border-[#1e90ff]/30 text-xs">
              <button
                onClick={() => setLayoutMode('3D_FORCE')}
                className={`px-2.5 py-1 rounded font-mono-code transition-all ${
                  layoutMode === '3D_FORCE' ? 'bg-[#1E90FF] text-white shadow-[0_0_10px_rgba(30,144,255,0.5)]' : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                FORCE
              </button>
              <button
                onClick={() => setLayoutMode('CONCENTRIC')}
                className={`px-2.5 py-1 rounded font-mono-code transition-all ${
                  layoutMode === 'CONCENTRIC' ? 'bg-[#1E90FF] text-white shadow-[0_0_10px_rgba(30,144,255,0.5)]' : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                RINGS
              </button>
              <button
                onClick={() => setLayoutMode('SPATIAL')}
                className={`px-2.5 py-1 rounded font-mono-code transition-all ${
                  layoutMode === 'SPATIAL' ? 'bg-[#1E90FF] text-white shadow-[0_0_10px_rgba(30,144,255,0.5)]' : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                RISK CLUSTER
              </button>
            </div>

            {/* Filter Toggle */}
            <button
              onClick={() => setIsFilterOpen(!isFilterOpen)}
              className={`p-2 rounded-lg border text-xs flex items-center space-x-1.5 transition-all ${
                isFilterOpen 
                  ? 'bg-[#1E90FF] text-white border-[#1e90ff]' 
                  : 'bg-[#020713]/40 backdrop-blur-md text-slate-300 border-[#1e90ff]/30 hover:border-[#1e90ff]/60'
              }`}
            >
              <Filter className="w-3.5 h-3.5" />
              <span className="font-mono-code text-[11px]">FILTERS</span>
            </button>

            {/* Reset Camera */}
            <button
              onClick={resetCamera}
              title="Reset Camera Orientation"
              className="p-2 bg-[#020713]/40 backdrop-blur-md rounded-lg border border-[#1e90ff]/30 text-slate-300 hover:text-white hover:border-[#1e90ff]/60 transition-all cursor-pointer"
            >
              <RotateCcw className="w-3.5 h-3.5" />
            </button>
          </>
        )}
      </div>

      {/* Collapsible Filter & Threshold Drawer */}
      {isFilterOpen && (
        <div className="absolute top-16 right-4 z-20 w-72 bg-[#0a1224]/95 backdrop-blur-xl border border-cyan-500/30 rounded-xl p-4 shadow-2xl space-y-4 animate-in fade-in slide-in-from-top-2 duration-200">
          <div>
            <div className="flex justify-between items-center mb-2">
              <span className="text-xs font-mono-code text-cyan-300 font-semibold uppercase tracking-wider flex items-center gap-1.5">
                <Sliders className="w-3 h-3" /> Min Confidence
              </span>
              <span className="text-xs font-mono-code text-cyan-400 font-bold">{minConfidence}%</span>
            </div>
            <input
              type="range"
              min="0"
              max="95"
              step="5"
              value={minConfidence}
              onChange={(e) => setMinConfidence(Number(e.target.value))}
              className="w-full h-1.5 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-cyan-400"
            />
          </div>

          <div>
            <span className="text-xs font-mono-code text-cyan-300 font-semibold uppercase tracking-wider mb-2 block">
              Entity Visibility
            </span>
            <div className="grid grid-cols-2 gap-1.5 max-h-48 overflow-y-auto pr-1">
              {(Object.keys(activeTypeFilters) as EntityType[]).map(type => (
                <button
                  key={type}
                  onClick={() => toggleTypeFilter(type)}
                  className={`text-[10px] font-mono-code px-2 py-1.5 rounded flex items-center justify-between border transition-all ${
                    activeTypeFilters[type]
                      ? 'bg-cyan-950/40 border-cyan-500/40 text-cyan-200'
                      : 'bg-slate-900/40 border-slate-800 text-slate-500 hover:text-slate-400'
                  }`}
                >
                  <span>{type}</span>
                  <span className={`w-1.5 h-1.5 rounded-full ${activeTypeFilters[type] ? 'bg-cyan-400' : 'bg-slate-700'}`}></span>
                </button>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* 3D WebGL Canvas Container */}
      <div
        ref={containerRef}
        className="w-full h-full cursor-grab active:cursor-grabbing relative flex-1"
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onWheel={handleWheel}
        onClick={handleClick}
      />

      {/* Node Hover Tooltip Card */}
      {hoveredNode && (
        <div 
          style={{ left: `${tooltipPos.x}px`, top: `${tooltipPos.y}px` }}
          className="absolute z-30 bg-[#070e1c]/95 backdrop-blur-md border border-cyan-500/50 rounded-xl p-3 shadow-2xl text-xs w-60 pointer-events-none animate-in fade-in duration-100 font-mono-code transition-all ease-out"
        >
          <div className="flex items-center justify-between space-x-2 mb-1.5">
            <span className="font-bold text-white text-sm truncate">{hoveredNode.name}</span>
            <span className={`px-2 py-0.5 rounded text-[10px] font-bold shrink-0 ${
              hoveredNode.riskLevel === 'CRITICAL' ? 'bg-red-500/20 text-red-400 border border-red-500/40' :
              hoveredNode.riskLevel === 'HIGH' ? 'bg-amber-500/20 text-amber-400 border border-amber-500/40' :
              'bg-cyan-500/20 text-cyan-400 border border-cyan-500/40'
            }`}>
              {hoveredNode.type}
            </span>
          </div>
          <div className="text-slate-300 space-y-0.5 text-[11px]">
            {hoveredNode.riskScore && <div>Risk Rating: <span className="text-cyan-300 font-bold">{hoveredNode.riskScore}/100</span></div>}
            {hoveredNode.connectionsCount && <div>Network Degree: <span className="text-slate-200">{hoveredNode.connectionsCount} links</span></div>}
            {hoveredNode.firstSeen && <div>First Seen: <span className="text-slate-400">{hoveredNode.firstSeen}</span></div>}
          </div>
        </div>
      )}

      {/* Legend Footer */}
      <div className="absolute bottom-4 right-4 z-20 flex items-center space-x-3 bg-[#091122]/90 backdrop-blur-md px-3 py-1.5 rounded-lg border border-slate-800 text-[10px] font-mono-code text-slate-400">
        <span className="flex items-center space-x-1">
          <span className="w-2 h-2 rounded-full bg-cyan-400"></span>
          <span>Actor</span>
        </span>
        <span className="flex items-center space-x-1">
          <span className="w-2 h-2 rounded-full bg-[#22D3EE]"></span>
          <span>Alias</span>
        </span>
        <span className="flex items-center space-x-1">
          <span className="w-2 h-2 bg-amber-400 rotate-45"></span>
          <span>Wallet</span>
        </span>
        <span className="flex items-center space-x-1">
          <span className="w-2 h-2 bg-emerald-400"></span>
          <span>Domain</span>
        </span>
        <span className="flex items-center space-x-1">
          <span className="w-2 h-2 rounded-full bg-rose-500"></span>
          <span>Forum</span>
        </span>
      </div>
    </div>
  );
};
