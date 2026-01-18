import TestButton from '@/test/Button/TestButton'
import TestInput from '@/test/Input/TestInput'
import TestSelection from '@/test/Selection/TestSelection'

export const HomePage = () => {
  return (
    <div style={{ padding: '2rem', maxWidth: '800px', margin: '0 auto' }}>
      <h1 style={{ marginBottom: '2rem' }}>Component Demo</h1>

      <h2 style={{ marginBottom: '1rem', borderBottom: '1px solid #e5e7eb', paddingBottom: '0.5rem' }}>
        Button Components
      </h2>
      <TestButton />

      <h2 style={{ marginTop: '3rem', marginBottom: '1rem', borderBottom: '1px solid #e5e7eb', paddingBottom: '0.5rem' }}>
        Input Components
      </h2>
      <TestInput />

      <h2 style={{ marginTop: '3rem', marginBottom: '1rem', borderBottom: '1px solid #e5e7eb', paddingBottom: '0.5rem' }}>
        Selection Components
      </h2>
      <TestSelection />
    </div>
  )
}
