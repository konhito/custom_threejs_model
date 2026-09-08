"use client";

import { Canvas, useThree } from "@react-three/fiber";
import { OrbitControls } from "@react-three/drei";
import { useEffect, useState } from "react";
import * as THREE from "three";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader.js";
import { KTX2Loader } from "three/examples/jsm/loaders/KTX2Loader.js";
import styles from "./AssetViewer.module.css";

const glbs = ["andes_c-Dtj79C6i.glb","beargeo6-B42pLxHk.glb","beartracking_c-DP61cBiV.glb","beartracking-v6-C4qK1KgU.glb","cam-D3kcEJpt.glb","headwaters_c-KCdfD60F.glb","lidar_c-D0MfanPy.glb","lidar_cam-DaDE86xa.glb","lowlands_c-gFpCo1b3.glb","plume_c-B7MfDuIT.glb","tripo_pbr_model_90ff91b2-5e7f-4500-9678-a12e1a1109c3_meshopt.glb"];
const ktx2 = ["a-quest-for-vanishing-ice-BVkiF1fC.ktx2","anc_ama_rockart_map-CSiu0JUj.ktx2","andean_bears_map-DUSdIoWT.ktx2","andes-intro-bg-s-CSpou73Y.ktx2","aqu_head_no_one_knows_map-DhnoPlDT.ktx2","aquatic-life-in-paradise-O48jUGye.ktx2","bear-hdr-QRJGqur_.ktx2","bears-and-cloud-forests-GjRrZcLu.ktx2","flooded-forest-CNrdTnQt.ktx2","how-to-save-a-monster-fish-D5L4C4JK.ktx2","mangroves_map-BDKnMxd6.ktx2","mangroves-DQKh3ac6.ktx2","master_map_flat-DQ4WB1F-.ktx2","nobody-nows-this-place-l1s4E_b7.ktx2","pink-dolphins-CCEQ5Lji.ktx2","price_of_au_map-B8sLCXk6.ktx2","pulse_flooded_forest_map-CZiUfHsF.ktx2","river_mouth_and_plume_map-C1c2lq9W.ktx2","rock-art-of-the-amazon-BmzcsBBg.ktx2","sacred_spirits_pink_dolphin_map-B60QT09C.ktx2","sacred-spirits-CvUFyv00.ktx2","the-ancient-amazonians-HI6lg0BH.ktx2","the-plume-CR4BtB6R.ktx2","the-price-of-gold-BwPV2PmQ.ktx2","the-pulse-zGhmWNpe.ktx2","the-source-CnZeAVpD.ktx2","water-CoMqpef6.ktx2","where-the-amazon-begins-DosYT4sk.ktx2","where-the-river-parts-the-sea-so7OQwEI.ktx2"];

function GLB({ file }) {
  const { gl } = useThree(); const [scene, setScene] = useState();
  useEffect(() => { let dead=false; const k=new KTX2Loader().setTranscoderPath("/basis/").detectSupport(gl); const l=new GLTFLoader().setKTX2Loader(k); l.load(`/experience/${file}`, g=>!dead&&setScene(g.scene), undefined, e=>console.error(e)); return ()=>{dead=true;k.dispose();}; }, [file,gl]);
  return scene ? <primitive object={scene} /> : null;
}
function KTX({ file }) { const { gl, scene }=useThree(); useEffect(()=>{let dead=false; const k=new KTX2Loader().setTranscoderPath("/basis/").detectSupport(gl); k.load(`/experience/${file}`,t=>{if(dead)return t.dispose();t.colorSpace=THREE.SRGBColorSpace;scene.background=t;}); return()=>{dead=true;if(scene.background?.isTexture)scene.background.dispose();scene.background=null;k.dispose();};},[file,gl,scene]); return null; }

export default function AssetViewer() {
  const [g,setG]=useState(glbs[0]); const [k,setK]=useState(ktx2[0]);
  return <main className={styles.page}><h1>Downloaded scene assets</h1><p>GLB and KTX2 preview — choose any file to inspect it.</p><section className={styles.grid}><div><label>GLB scene<select value={g} onChange={e=>setG(e.target.value)}>{glbs.map(x=><option key={x}>{x}</option>)}</select></label><div className={styles.canvas}><Canvas camera={{position:[0,0,8],fov:45}}><color attach="background" args={["#071923"]}/><ambientLight intensity={2}/><directionalLight position={[3,5,4]} intensity={3}/><GLB file={g}/><OrbitControls/></Canvas></div></div><div><label>KTX2 texture<select value={k} onChange={e=>setK(e.target.value)}>{ktx2.map(x=><option key={x}>{x}</option>)}</select></label><div className={styles.canvas}><Canvas><KTX file={k}/></Canvas></div></div></section></main>;
}
