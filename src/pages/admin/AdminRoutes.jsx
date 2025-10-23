import { Routes, Route } from "react-router-dom";
import AdminLayout from "./AdminLayout";
import AdminDashboard from "./AdminDashboard";
import UsersPage from "./UsersPage";
import SubscriptionPlansPage from "./SubscriptionPlansPage";
import PlannersPage from "./PlannersPage";
import CategoriesPage from "./CategoriesPage";
import AccountsPage from "./AccountsPage";
import TransactionsPage from "./TransactionsPage";

export default function AdminRoutes() {
  return (
    <Routes>
      <Route path="/" element={<AdminLayout />}>
        <Route index element={<AdminDashboard />} />
        <Route path="users" element={<UsersPage />} />
        <Route path="plans" element={<SubscriptionPlansPage />} />
        <Route path="planners" element={<PlannersPage />} />
        <Route path="categories" element={<CategoriesPage />} />
        <Route path="accounts" element={<AccountsPage />} />
        <Route path="transactions" element={<TransactionsPage />} />
      </Route>
    </Routes>
  );
}
