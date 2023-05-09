import { easing } from 'maath'
import { useSnapshot } from 'valtio'
import { useFrame } from '@react-three/fiber'
import { Decal, useGLTF, useTexture } from '@react-three/drei'

import state from '../store'

const Shirt = () => {
	const snap = useSnapshot(state)
	const { nodes, materials } = useGLTF('/shirt_baked.glb')

	// Logo Decal to be applied to the center of the shirt.
	const logoTexture = useTexture(snap.logoDecal)
	// Logo Decal to be applied blown up to the shirt.
	const fullTexture = useTexture(snap.fullDecal)

	// Applies color smoothly with easing
	useFrame((state, delta) =>
		easing.dampC(materials.lambert1.color, snap.color, 0.25, delta)
	)

	// Shirt will at times not update
	// A string of the current state needs to be passed in as a key.
	// Allows for React to rerender the model when state changes.
	const stateString = JSON.stringify(snap)

	return (
		<group key={stateString}>
			<mesh
				castShadow
				geometry={nodes.T_Shirt_male.geometry}
				material={materials.lambert1}
				material-roughness={1}
				dispose={null}>
				{snap.isFullTexture && (
					<Decal
						position={[0, 0, 0]}
						rotation={[0, 0, 0]}
						scale={1}
						map={fullTexture}
					/>
				)}

				{snap.isLogoTexture && (
					<Decal
						position={[0, 0.04, 0.15]}
						rotation={[0, 0, 0]}
						scale={0.15}
						map={logoTexture}
						map-anisotropy={16}
						depthTest={false}
						depthWrite={true}
					/>
				)}
			</mesh>
		</group>
	)
}

export default Shirt
