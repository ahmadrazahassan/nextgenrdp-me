{/* Example of how the tabs should be structured - this is meant to be manually integrated */}

{/* Where you currently have the TabsList */}
<div className="mt-6">
  <Tabs defaultValue="details" value={activeTab} onValueChange={setActiveTab}>
    <TabsList className="w-full bg-white/10 p-1 rounded-xl border border-white/20 grid grid-cols-4">
      <TabsTrigger 
        value="details" 
        className="rounded-lg text-white data-[state=active]:bg-white/20 data-[state=active]:text-white"
      >
        Details
      </TabsTrigger>
      <TabsTrigger 
        value="connection" 
        className="rounded-lg text-white data-[state=active]:bg-white/20 data-[state=active]:text-white"
      >
        Connection
      </TabsTrigger>
      <TabsTrigger 
        value="resources" 
        className="rounded-lg text-white data-[state=active]:bg-white/20 data-[state=active]:text-white"
      >
        Resources
      </TabsTrigger>
      <TabsTrigger 
        value="billing" 
        className="rounded-lg text-white data-[state=active]:bg-white/20 data-[state=active]:text-white"
      >
        Billing
      </TabsTrigger>
    </TabsList>

    {/* All your TabsContent components should be inside this Tabs component */}
    <TabsContent value="details" className="focus-visible:outline-none focus-visible:ring-0 text-slate-800 dark:text-slate-200 data-[state=active]:flex flex-col">
      {/* Details content */}
    </TabsContent>
    
    <TabsContent value="connection" className="focus-visible:outline-none focus-visible:ring-0 text-slate-800 dark:text-slate-200 data-[state=active]:flex flex-col">
      {/* Connection content */}
    </TabsContent>
    
    <TabsContent value="resources" className="focus-visible:outline-none focus-visible:ring-0 text-slate-800 dark:text-slate-200 data-[state=active]:flex flex-col">
      {/* Resources content */}
    </TabsContent>
    
    <TabsContent value="billing" className="focus-visible:outline-none focus-visible:ring-0 text-slate-800 dark:text-slate-200 data-[state=active]:flex flex-col">
      {/* Billing content */}
    </TabsContent>
  </Tabs>
</div>

{/* Note: You need to ensure all TabsContent components are wrapped inside the same Tabs component 
   that contains the TabsList. The error occurs when TabsList is used outside of a Tabs component */} 