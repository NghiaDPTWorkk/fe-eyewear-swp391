export const CustomerHomePage = () => {
  return (
    <div style={{ padding: '2rem', maxWidth: '800px', margin: '0 auto' }}>
      <h1 style={{ marginBottom: '2rem' }}>Component Demo</h1>
      <div style={{ display: 'flex', gap: '1rem' }}>
        <a
          href="/operationstaff/dashboard"
          style={{
            padding: '10px 20px',
            background: '#4fdab4',
            color: 'white',
            borderRadius: '8px',
            textDecoration: 'none',
            fontWeight: 'bold'
          }}
        >
          Go to Operation Staff
        </a>
        <a
          href="/salestaff/dashboard"
          style={{
            padding: '10px 20px',
            background: '#3b82f6',
            color: 'white',
            borderRadius: '8px',
            textDecoration: 'none',
            fontWeight: 'bold'
          }}
        >
          Go to Sales Staff
        </a>
      </div>
    </div>
  )
}
