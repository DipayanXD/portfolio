import Silk from './components/Silk.tsx';

export function App() {
  return (
    <div className="w-full h-screen">
      <Silk
        speed={5}
        scale={1}
        color="#7B7481"
        noiseIntensity={1.5}
        rotation={0}
      />
    </div>
  )
}

export default App
