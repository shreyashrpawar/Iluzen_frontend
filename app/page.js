'use client'
import React from 'react'
import Link from 'next/link'
import styles from './styles/landing.module.scss'
import { Server, Database, Users } from 'lucide-react'

export default function Home() {
  return (
    <div className={styles.container}>
      <nav className={styles.nav}>
        <div className={styles.logo}>
          <div style={{width:36,height:36,borderRadius:8,background:'linear-gradient(90deg,#7c3aed,#06b6d4)'}} />
          <span>Ilusion</span>
        </div>
        <div style={{display:'flex',gap:12,alignItems:'center'}}>
          <Link href="/login">Sign in</Link>
          <Link href="/register"><button className={styles['button-primary']}>Get Started</button></Link>
        </div>
      </nav>

      <main className={styles.hero}>
        <section className={styles.headline}>
          <h1>Realistic test data. Zero setup.</h1>
          <p>Generate fake APIs, sandboxed databases, and mock auth flows for development and testing — instantly.</p>

          <div className={styles.controls}>
            <Link href="/register"><button className={styles['button-primary']}>Create Free</button></Link>
            <Link href="#learn"><button className={styles['button-ghost']}>Learn More</button></Link>
          </div>

          <div className={styles.stats}>
            <div className="stat">Instant APIs</div>
            <div className="stat">Sandbox DBs</div>
            <div className="stat">Mock Auth</div>
          </div>

          <div className={styles.features}>
            <div className={styles['card-feature']}><Server/> <div><strong>Mock APIs</strong><div style={{color:'#6b7280'}}>Custom endpoints with JSON responses</div></div></div>
            <div className={styles['card-feature']}><Database/> <div><strong>Virtual DBs</strong><div style={{color:'#6b7280'}}>Temporary MySQL instances for testing</div></div></div>
            <div className={styles['card-feature']}><Users/> <div><strong>Auth Flows</strong><div style={{color:'#6b7280'}}>Simulate login, roles and tokens</div></div></div>
          </div>
        </section>

        <aside className={styles.panel}>
          <h3>Try an example request</h3>
          <pre style={{background:'#f8fafc',padding:12,borderRadius:8}}>GET https://api.example.com/users?limit=10</pre>

          <div style={{marginTop:12}}>
            <label style={{display:'block',color:'#6b7280',fontSize:13}}>Email for demo</label>
            <div style={{display:'flex',gap:8,marginTop:8}}>
              <input placeholder="you@company.com" style={{flex:1,padding:10,borderRadius:8,border:'1px solid #e6eef6'}} />
              <button className={styles['button-primary']}>Send</button>
            </div>
          </div>

          <div style={{marginTop:16}} className={styles.stats}>
            <div className="stat">API servers: 0</div>
            <div className="stat">Databases: 0</div>
          </div>
        </aside>
      </main>

      {/* Expanded content for conversion */}
      <section id="learn" style={{padding:'2rem 1rem'}}>
        <div style={{maxWidth:1100,margin:'0 auto'}}>
          <h2 style={{fontSize:28,marginBottom:12}}>What you can build</h2>
          <div className={styles.featuresGrid}>
            <div className={styles.featureCard}><strong>Users & Auth</strong><div style={{color:'#6b7280'}}>Simulate users, roles, and login flows with tokens.</div></div>
            <div className={styles.featureCard}><strong>Products & Orders</strong><div style={{color:'#6b7280'}}>Generate realistic product catalogs and order streams.</div></div>
            <div className={styles.featureCard}><strong>Realtime Mocking</strong><div style={{color:'#6b7280'}}>Create endpoints that return dynamic responses.</div></div>
            <div className={styles.featureCard}><strong>Virtual MySQL</strong><div style={{color:'#6b7280'}}>Temporary databases seeded with sample data.</div></div>
            <div className={styles.featureCard}><strong>Team Sharing</strong><div style={{color:'#6b7280'}}>Share demo servers with teammates and clients.</div></div>
            <div className={styles.featureCard}><strong>Edge Cases</strong><div style={{color:'#6b7280'}}>Easily test errors, pagination and rate-limit scenarios.</div></div>
          </div>

          <h2 style={{fontSize:28,marginTop:28}}>How it works</h2>
          <div className={styles.how}>
            <div className={styles.howStep}><strong>1 — Create</strong><div style={{color:'#6b7280'}}>Spin up mock APIs with a few clicks.</div></div>
            <div className={styles.howStep}><strong>2 — Seed</strong><div style={{color:'#6b7280'}}>Auto-generate sample data or import CSVs.</div></div>
            <div className={styles.howStep}><strong>3 — Integrate</strong><div style={{color:'#6b7280'}}>Use the endpoint in your app instantly.</div></div>
          </div>

          <h2 style={{fontSize:28,marginTop:28}}>Pricing</h2>
          <div className={styles.pricing}>
            <div className={styles.pricingCard}><strong>Free</strong><div style={{color:'#6b7280'}}>For individuals — 3 APIs, 1 DB</div><div style={{marginTop:8,fontWeight:700}}>Free</div></div>
            <div className={styles.pricingCard}><strong>Team</strong><div style={{color:'#6b7280'}}>Unlimited APIs, shared DBs, teams</div><div style={{marginTop:8,fontWeight:700}}>$12 / user</div></div>
            <div className={styles.pricingCard}><strong>Enterprise</strong><div style={{color:'#6b7280'}}>SAML, dedicated instances, priority support</div><div style={{marginTop:8,fontWeight:700}}>Contact us</div></div>
          </div>

          <h2 style={{fontSize:28,marginTop:28}}>Trusted by developers</h2>
          <div className={styles.testimonialGrid}>
            <div className={styles.featureCard}><strong>“Saved our dev team weeks.”</strong><div style={{color:'#6b7280',marginTop:6}}>— Frontend Lead at Acme</div></div>
            <div className={styles.featureCard}><strong>“Perfect for QA and demos.”</strong><div style={{color:'#6b7280',marginTop:6}}>— QA Engineer at ExampleCorp</div></div>
          </div>

          <div className={styles.ctaLarge}>
            <h3 style={{margin:0}}>Ready to try realistic test data?</h3>
            <p style={{color:'#6b7280'}}>Start a free sandbox and get API endpoints and a demo database in seconds.</p>
            <div className={styles.leadForm}>
              <input placeholder="you@company.com" style={{flex:1,padding:12,borderRadius:10,border:'1px solid #e6eef6'}} />
              <button className={styles['button-primary']}>Get my sandbox</button>
            </div>
          </div>
        </div>
      </section>

      <footer className={styles.footer}>
        <div style={{maxWidth:1100,margin:'0 auto',display:'flex',justifyContent:'space-between',alignItems:'center',gap:12}}>
          <div>© 2026 Ilusion — Fake Data/API Platform</div>
          <div style={{color:'#6b7280'}}>Terms • Privacy • Docs</div>
        </div>
      </footer>
    </div>
  )
}