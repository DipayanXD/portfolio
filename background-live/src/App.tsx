import LiquidEther from './components/LiquidEther';

export default function App() {
  return (
    <div style={{ width: '100%', height: '100vh', position: 'relative', backgroundColor: '#060010' }}>
      <LiquidEther
        colors={['#5227FF', '#FF9FFC', '#B19EEF']}
        mouseForce={20}
        cursorSize={100}
        isViscous={false}
        viscous={30}
        iterationsViscous={15}
        iterationsPoisson={15}
        resolution={0.2}
        isBounce={false}
        autoDemo={true}
        autoSpeed={1}
        autoIntensity={2.2}
        takeoverDuration={0.25}
        autoResumeDelay={3000}
        autoRampDuration={0.6}
      />
    </div>
  )
}
