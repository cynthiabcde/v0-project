"use client";

import { useState } from "react";
import { AlertRuleList } from "@/components/alert-rule-list";
import { AlertRuleDialog } from "@/components/alert-rule-dialog";
import { AlertRule, SAMPLE_RULES } from "@/lib/alert-data";
import { Bell, Settings, ChevronDown } from "lucide-react";

export default function AlertRulesPage() {
  const [rules, setRules] = useState<AlertRule[]>(SAMPLE_RULES);
  const [searchName, setSearchName] = useState("");
  const [searchShopId, setSearchShopId] = useState("");
  const [searchStatus, setSearchStatus] = useState("");
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingRule, setEditingRule] = useState<AlertRule | null>(null);
  const [activeMenu, setActiveMenu] = useState("报警管理");

  const filteredRules = rules.filter((rule) => {
    const matchName = !searchName || rule.name.includes(searchName);
    const matchShopId = !searchShopId || rule.shopIds.some((id) => id.includes(searchShopId));
    const matchStatus = !searchStatus || 
      (searchStatus === "使用中" && rule.enabled && !rule.deprecated) ||
      (searchStatus === "已暂停" && !rule.enabled && !rule.deprecated) ||
      (searchStatus === "已作废" && rule.deprecated);
    return matchName && matchShopId && matchStatus;
  });

  const handleCreateRule = () => {
    setEditingRule(null);
    setIsDialogOpen(true);
  };

  const handleEditRule = (rule: AlertRule) => {
    setEditingRule(rule);
    setIsDialogOpen(true);
  };

  const handleDeleteRule = (ruleId: string) => {
    setRules(rules.map((r) => (r.id === ruleId ? { ...r, deprecated: true, enabled: false } : r)));
  };

  const handleToggleRule = (ruleId: string) => {
    setRules(rules.map((r) => (r.id === ruleId ? { ...r, enabled: !r.enabled } : r)));
  };

  const handleSaveRule = (rule: AlertRule) => {
    if (editingRule) {
      setRules(rules.map((r) => (r.id === rule.id ? rule : r)));
    } else {
      setRules([...rules, { ...rule, id: `${Date.now()}`, deprecated: false }]);
    }
    setIsDialogOpen(false);
    setEditingRule(null);
  };

  const handleSearch = () => {
    // 搜索由 filteredRules 实时计算
  };

  return (
    <div className="min-h-screen bg-[#f5f5f5] flex">
      {/* 左侧边栏 */}
      <aside className="w-[140px] bg-white border-r border-[#e8e8e8] flex-shrink-0">
        <div className="p-4">
          <div 
            className={`flex items-center gap-2 px-3 py-2 rounded cursor-pointer text-sm ${activeMenu === "礼包管理" ? "bg-[#e6f7ff] text-[#1890ff]" : "text-[#333] hover:bg-[#f5f5f5]"}`}
            onClick={() => setActiveMenu("礼包管理")}
          >
            <Settings className="w-4 h-4" />
            礼包管理
          </div>
          <div 
            className={`flex items-center gap-2 px-3 py-2 rounded cursor-pointer text-sm mt-1 ${activeMenu === "报警管理" ? "bg-[#e6f7ff] text-[#1890ff]" : "text-[#333] hover:bg-[#f5f5f5]"}`}
            onClick={() => setActiveMenu("报警管理")}
          >
            <Bell className="w-4 h-4" />
            报警管理
          </div>
        </div>
      </aside>

      {/* 主内容区 */}
      <div className="flex-1 flex flex-col">
        {/* 顶部导航 */}
        <header className="h-12 bg-white border-b border-[#e8e8e8] flex items-center justify-between px-4">
          <div className="flex items-center gap-6">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 bg-[#1890ff] rounded-lg flex items-center justify-center">
                <span className="text-white text-sm font-bold">礼</span>
              </div>
              <span className="font-medium text-[#1890ff]">礼包中心</span>
            </div>
            <nav className="flex items-center gap-4 text-sm">
              <span className="text-[#333] cursor-pointer hover:text-[#1890ff]">礼包管理</span>
              <span className="text-[#999] cursor-pointer hover:text-[#1890ff]">系统设置</span>
            </nav>
          </div>
          <div className="flex items-center gap-2 text-sm">
            <span className="text-[#333]">系统管理员11</span>
            <div className="w-8 h-8 bg-[#87d068] rounded-full flex items-center justify-center text-white text-xs">
              管
            </div>
          </div>
        </header>

        {/* 标签栏 */}
        <div className="h-10 bg-white border-b border-[#e8e8e8] flex items-center px-4">
          <div className="flex items-center gap-1 bg-[#1890ff] text-white px-3 py-1 rounded text-sm">
            <span className="w-1.5 h-1.5 bg-white rounded-full"></span>
            报警管理
            <span className="ml-1 cursor-pointer">×</span>
          </div>
        </div>

        {/* 内容区 */}
        <main className="flex-1 p-4">
          {/* 搜索区 */}
          <div className="bg-white rounded p-4 mb-4">
            <div className="flex items-center gap-4 flex-wrap">
              <div className="flex items-center gap-2">
                <span className="text-sm text-[#333]">规则名称</span>
                <input
                  type="text"
                  placeholder="请输入规则名称"
                  value={searchName}
                  onChange={(e) => setSearchName(e.target.value)}
                  className="h-8 px-3 border border-[#d9d9d9] rounded text-sm w-[180px] focus:border-[#1890ff] focus:outline-none"
                />
              </div>
              <div className="flex items-center gap-2">
                <span className="text-sm text-[#333]">店铺ID</span>
                <input
                  type="text"
                  placeholder="请输入店铺ID"
                  value={searchShopId}
                  onChange={(e) => setSearchShopId(e.target.value)}
                  className="h-8 px-3 border border-[#d9d9d9] rounded text-sm w-[180px] focus:border-[#1890ff] focus:outline-none"
                />
              </div>
              <div className="flex items-center gap-2">
                <span className="text-sm text-[#333]">状态</span>
                <div className="relative">
                  <select
                    value={searchStatus}
                    onChange={(e) => setSearchStatus(e.target.value)}
                    className="h-8 px-3 pr-8 border border-[#d9d9d9] rounded text-sm w-[140px] focus:border-[#1890ff] focus:outline-none appearance-none bg-white"
                  >
                    <option value="">请选择状态</option>
                    <option value="使用中">使用中</option>
                    <option value="已暂停">已暂停</option>
                    <option value="已作废">已作废</option>
                  </select>
                  <ChevronDown className="absolute right-2 top-1/2 -translate-y-1/2 w-4 h-4 text-[#999] pointer-events-none" />
                </div>
              </div>
              <div className="flex-1"></div>
              <button
                onClick={handleSearch}
                className="h-8 px-4 bg-[#1890ff] text-white text-sm rounded hover:bg-[#40a9ff]"
              >
                查询
              </button>
              <button
                onClick={handleCreateRule}
                className="h-8 px-4 border border-[#1890ff] text-[#1890ff] text-sm rounded hover:bg-[#e6f7ff]"
              >
                新建规则
              </button>
            </div>
          </div>

          {/* 表格区 */}
          <AlertRuleList
            rules={filteredRules}
            onEdit={handleEditRule}
            onDelete={handleDeleteRule}
            onToggle={handleToggleRule}
          />
        </main>
      </div>

      {/* 弹窗 */}
      <AlertRuleDialog
        open={isDialogOpen}
        onOpenChange={setIsDialogOpen}
        rule={editingRule}
        onSave={handleSaveRule}
      />
    </div>
  );
}
