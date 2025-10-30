import api from "../../config/api";

export const userGoalDepositApi = {
  deposit: async ({ goalId, accountId, amount }) => {
    const payload = {
      goal_id: Number(goalId),
      account_id: Number(accountId),
      amount: Number(amount),
    };
    const response = await api.post("/user/goal_deposit/deposit", payload);
    return response.data;
  },
  withdraw: async ({ goalId, accountId, amount }) => {
    const payload = {
      goal_id: Number(goalId),
      account_id: Number(accountId),
      amount: Number(amount),
    };
    const response = await api.post("/user/goal_deposit/withdraw", payload);
    return response.data;
  },
};

export const userGoalsApi = {
  createGoal: async ({
    plannerId,
    name,
    targetAmount,
    targetDate,
    color,
    priority,
  }) => {
    const payload = {
      planner_id: Number(plannerId),
      name: name,
      target_amount: Number(targetAmount),
      target_date: targetDate || undefined,
      color: color || undefined,
      priority: priority || undefined,
    };
    const response = await api.post("/my/goal/create", payload);
    return response.data;
  },
  getUserGoals: async (page = 1, pageSize = 20, search = "") => {
    const response = await api.get("/my/goals", {
      params: { page, page_size: pageSize, search: search || undefined },
    });
    return response.data;
  },
  getGoalsByPlannerId: async (
    plannerId,
    page = 1,
    pageSize = 20,
    search = ""
  ) => {
    const response = await api.get(`/my/planner/${Number(plannerId)}/goals`, {
      params: { page, page_size: pageSize, search: search || undefined },
    });
    return response.data;
  },
  updateGoal: async (
    goalId,
    { name, targetAmount, targetDate, color, priority }
  ) => {
    const payload = {
      name: name?.trim(),
      target_amount:
        typeof targetAmount === "number" ? targetAmount : Number(targetAmount),
      target_date: targetDate || undefined,
      color: color || undefined,
      priority: priority ? String(priority).toLowerCase() : undefined,
    };
    const response = await api.put(`/my/goal/${Number(goalId)}`, payload);
    return response.data;
  },
  deleteGoal: async (goalId, accountId) => {
    const response = await api.delete(`/my/goal/${Number(goalId)}`, {
      data: accountId ? { account_id: Number(accountId) } : {},
    });
    return response.data;
  },
  markAsAchieved: async (goalId) => {
    const response = await api.patch(
      `/my/goal/${Number(goalId)}/mark-achieved`
    );
    return response.data;
  },
  activateGoal: async (goalId) => {
    const response = await api.patch(`/my/goal/${Number(goalId)}/activate`);
    return response.data;
  },
  deactivateGoal: async (goalId, accountId) => {
    const payload = accountId ? { account_id: Number(accountId) } : {};
    const response = await api.patch(
      `/my/goal/${Number(goalId)}/deactivate`,
      payload
    );
    return response.data;
  },
};
