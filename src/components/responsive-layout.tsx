"use client"

export function ResponsiveLayout({ children }: { children: React.ReactNode }) {

  
  return (
    <div className="min-h-screen">
      <main 
        className="pt-8 transition-all duration-300 ease-out min-h-screen bg-background"
        style={{
          paddingLeft: '2rem',
          paddingRight: '2rem',
          paddingBottom: '2rem',
        }}
      >
        <div className="w-full h-full">
          {children}
        </div>
      </main>
    </div>
  )
}
