"use client";

import { useState } from "react";
import { Plus, Search, Bell } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { AlertRuleList } from "@/components/alert-rule-list";
import { AlertRuleDialog } from "@/components/alert-rule-dialog";
import { AlertRule, MOCK_RULES } from "@/lib/alert-data";

export default function AlertRulesPage() {
  const [rules, setRules] = useState<AlertRule[]>(MOCK_RULES);
  const [searchQuery, setSearchQuery] = useState("");
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingRule, setEditingRule] = useState<AlertRule | null>(null);

  const filteredRules = rules.filter(
    (rule) =>
      rule.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      rule.shopIds.some((id) => id.includes(searchQuery))
  );

  const handleCreateRule = () => {
    setEditingRule(null);
    setIsDialogOpen(true);
  };

  const handleEditRule = (rule: AlertRule) => {
    setEditingRule(rule);
    setIsDialogOpen(true);
  };

  const handleDeleteRule = (ruleId: string) => {
    setRules(rules.filter((r) => r.id !== ruleId));
  };

  const handleToggleRule = (ruleId: string) => {
    setRules(
      rules.map((r) =>
        r.id === ruleId ? { ...r, enabled: !r.enabled } : r
      )
    );
  };

  const handleSaveRule = (rule: AlertRule) => {
    if (editingRule) {
      setRules(rules.map((r) => (r.id === rule.id ? rule : r)));
    } else {
      setRules([...rules, { ...rule, id: `rule_${Date.now()}` }]);
    }
    setIsDialogOpen(false);
    setEditingRule(null);
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border">
        <div className="mx-auto max-w-7xl px-6 py-4">
          <div className="flex items-center gap-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-chart-2/20">
              <Bell className="h-5 w-5 text-chart-2" />
            </div>
            <div>
              <h1 className="text-lg font-semibold text-foreground">报警规则配置</h1>
              <p className="text-sm text-muted-foreground">
                配置订单异常报警规则，支持按店铺、状态设置不同的报警人员和提示语
              </p>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="mx-auto max-w-7xl px-6 py-8">
        {/* Stats Cards */}
        <div className="mb-8 grid grid-cols-1 gap-4 sm:grid-cols-4">
          <div className="rounded-lg border border-border bg-card p-4">
            <div className="text-sm text-muted-foreground">全部规则</div>
            <div className="mt-1 text-2xl font-semibold text-foreground">{rules.length}</div>
          </div>
          <div className="rounded-lg border border-border bg-card p-4">
            <div className="text-sm text-muted-foreground">已启用</div>
            <div className="mt-1 text-2xl font-semibold text-success">{rules.filter(r => r.enabled).length}</div>
          </div>
          <div className="rounded-lg border border-border bg-card p-4">
            <div className="text-sm text-muted-foreground">已禁用</div>
            <div className="mt-1 text-2xl font-semibold text-muted-foreground">{rules.filter(r => !r.enabled).length}</div>
          </div>
          <div className="rounded-lg border border-border bg-card p-4">
            <div className="text-sm text-muted-foreground">关联店铺</div>
            <div className="mt-1 text-2xl font-semibold text-foreground">
              {new Set(rules.flatMap(r => r.shopIds)).size}
            </div>
          </div>
        </div>

        {/* Toolbar */}
        <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="relative max-w-sm flex-1">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              placeholder="搜索规则名称或店铺ID..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 bg-card border-border"
            />
          </div>
          <Button onClick={handleCreateRule} className="shrink-0">
            <Plus className="mr-2 h-4 w-4" />
            新建规则
          </Button>
        </div>

        {/* Rules List */}
        <AlertRuleList
          rules={filteredRules}
          onEdit={handleEditRule}
          onDelete={handleDeleteRule}
          onToggle={handleToggleRule}
        />

        {/* Create/Edit Dialog */}
        <AlertRuleDialog
          open={isDialogOpen}
          onOpenChange={setIsDialogOpen}
          rule={editingRule}
          onSave={handleSaveRule}
        />
      </main>
    </div>
  );
}
