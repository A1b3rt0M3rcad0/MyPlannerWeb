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
};
