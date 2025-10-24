import SideBar from "../SideBar";
import Header from "../Header";
import Footer from "../Footer";

export default function BasePage({ pageTitle, children, showPlannerSelector = false }) {
  return (
    <div className="flex h-screen bg-gradient-to-br from-secondary-900 via-secondary-800 to-secondary-900">
      {/* Background decorativo */}
      <div className="absolute inset-0 opacity-20">
        <div className="absolute top-0 right-0 w-96 h-96 bg-primary-500 rounded-full blur-3xl"></div>
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-primary-600 rounded-full blur-3xl"></div>
      </div>
      
      {/* Sidebar */}
      <SideBar />

      {/* Main area: header + content + footer */}
      <div className="flex flex-col flex-1 overflow-hidden relative z-10">
        {/* Header */}
        <Header pageTitle={pageTitle} showPlannerSelector={showPlannerSelector} />

        {/* Conteúdo principal: scrollable */}
        <main className="flex-1 overflow-auto p-6 bg-transparent">
          <div className="max-w-7xl mx-auto">{children}</div>
        </main>

        {/* Footer */}
        <Footer />
      </div>
    </div>
  );
}
