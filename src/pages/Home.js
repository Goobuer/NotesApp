
function Home() {
  return (
    <div className="container">
      <div className="hero-section" style={styles.heroSection}>
        <h1 style={styles.heroTitle}>Welcome to Your Productivity Hub</h1>
        <p style={styles.heroSubtitle}>Organize your notes and manage your tasks in one beautiful place</p>
        
        <div style={styles.featuresGrid}>
          <div className="card" style={styles.featureCard}>
            <div style={styles.featureIcon}>📝</div>
            <h3 style={styles.featureTitle}>Notes</h3>
            <p style={styles.featureText}>Capture your thoughts and ideas instantly</p>
          </div>
          
          <div className="card" style={styles.featureCard}>
            <div style={styles.featureIcon}>✓</div>
            <h3 style={styles.featureTitle}>To-Do Lists</h3>
            <p style={styles.featureText}>Keep track of your tasks and priorities</p>
          </div>
          
          <div className="card" style={styles.featureCard}>
            <div style={styles.featureIcon}>🔐</div>
            <h3 style={styles.featureTitle}>Secure</h3>
            <p style={styles.featureText}>Your data is protected with authentication</p>
          </div>
        </div>
      </div>
    </div>
  );
}

const styles = {
  heroSection: {
    textAlign: 'center',
    marginBottom: '48px'
  },
  heroTitle: {
    fontSize: '42px',
    fontWeight: '700',
    color: '#2c3e50',
    marginBottom: '16px',
    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
    WebkitBackgroundClip: 'text',
    WebkitTextFillColor: 'transparent',
  },
  heroSubtitle: {
    fontSize: '18px',
    color: '#7f8c8d',
    marginBottom: '48px',
    maxWidth: '600px',
    margin: '0 auto 48px'
  },
  featuresGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
    gap: '24px'
  },
  featureCard: {
    textAlign: 'center',
    padding: '32px !important'
  },
  featureIcon: {
    fontSize: '48px',
    marginBottom: '16px'
  },
  featureTitle: {
    fontSize: '20px',
    fontWeight: '600',
    color: '#2c3e50',
    marginBottom: '12px'
  },
  featureText: {
    color: '#7f8c8d',
    lineHeight: '1.6'
  }
};

export default Home;