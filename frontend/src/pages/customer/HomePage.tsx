import TestButton from "@/test/Button/TestButton"

export const HomePage = () => {
  return (
    <div style={{ padding: '2rem', maxWidth: '800px', margin: '0 auto' }}>
      <h1 style={{ marginBottom: '2rem' }}>Button Component Demo</h1>

      <TestButton />
    </div>
  )
}
