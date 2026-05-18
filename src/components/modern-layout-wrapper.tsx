"use client"

export function ModernLayoutWrapper({ children }: { children: React.ReactNode }) {
  return (
    <main 
      className="pt-16 transition-all duration-300 ease-out min-h-screen bg-background"
      style={{ 
        marginLeft: '0px',
        paddingLeft: '2rem',
        paddingRight: '2rem',
        paddingBottom: '2rem',
        width: '100vw',
        maxWidth: '100vw',
        minWidth: '100vw',
        transform: 'translateX(0)',
        opacity: 1,
        borderLeft: 'none'
      }}
    >
      <div className="w-full transition-all duration-300"
           style={{
             transform: 'scale(1)',
             opacity: 1
           }}>
        {children}
      </div>
    </main>
  )
}
