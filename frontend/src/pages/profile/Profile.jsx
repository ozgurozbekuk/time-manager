import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import toast from "react-hot-toast";
import {
  CircleUserRound,
  Mail,
  UserRound,
  ShieldCheck,
  CalendarClock,
  Trash2,
  RefreshCcw,
} from "lucide-react";
import { useAuthStore } from "../../store/authUser";

const formatDate = (input) => {
  if (!input) return "—";
  try {
    return new Intl.DateTimeFormat("en", {
      year: "numeric",
      month: "short",
      day: "numeric",
    }).format(new Date(input));
  } catch {
    return "—";
  }
};

const formatDuration = (seconds) => {
  if (!seconds || seconds <= 0) return "0m";
  const hrs = Math.floor(seconds / 3600);
  const mins = Math.floor((seconds % 3600) / 60);
  const secs = Math.floor(seconds % 60);
  if (hrs && mins) return `${hrs}h ${mins}m`;
  if (hrs) return `${hrs}h`;
  if (mins) return `${mins}m`;
  return `${secs}s`;
};

const Profile = () => {

  const [timeEntries, setTimeEntries] = useState([]);
  const [loadingTimeStats, setLoadingTimeStats] = useState(true);
  const chartColors = useMemo(
    () => [
      "#52D3D8",
      "#60A5FA",
      "#A855F7",
      "#F97316",
      "#F87171",
      "#34D399",
      "#EAB308",
      "#38BDF8",
    ],
    []
  );
  const chartRadius = 80;
  const chartStrokeWidth = 28;

  const navigate = useNavigate();
  const user = useAuthStore((state) => state.user);
  const logout = useAuthStore((state) => state.logout);
  const mergeUser = useAuthStore((state) => state.mergeUser);

  const [profile, setProfile] = useState(user);
  const [loading, setLoading] = useState(!user?.createdAt);
  const [updatingName, setUpdatingName] = useState(false);
  const [updatingPassword, setUpdatingPassword] = useState(false);
  const [nameInput, setNameInput] = useState(user?.fullName ?? "");
  const [passwordForm, setPasswordForm] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });
  const [taskStats, setTaskStats] = useState({
    today: 0,
    week: 0,
    month: 0,
  });
  const [taskStatsLoading, setTaskStatsLoading] = useState(true);

  useEffect(() => {
    if (!user) return;

    setProfile(user);
    if (!updatingName) {
      setNameInput(user.fullName ?? "");
    }

    if (user.createdAt) {
      setLoading(false);
      return;
    }

    let canceled = false;

    const fetchProfile = async () => {
      setLoading(true);
      try {
        const { data } = await axios.get("/api/auth/me");
        if (canceled) return;

        setProfile(data);
        setNameInput(data?.fullName ?? "");
        mergeUser(data);
      } catch (error) {
        if (canceled) return;
        const message =
          error?.response?.data?.error ||
          error?.message ||
          "Unable to load profile";
        toast.error(message);
      } finally {
        if (!canceled) setLoading(false);
      }
    };

    fetchProfile();

    return () => {
      canceled = true;
    };
  }, [user, mergeUser, updatingName]);

  useEffect(() => {
    if (!user) return;

    let canceled = false;

    const fetchTaskStats = async () => {
      setTaskStatsLoading(true);
      try {
        const { data } = await axios.get("/api/tasks");
        if (canceled) return;

        const tasks = Array.isArray(data) ? data : [];
        const now = new Date();
        const startOfToday = new Date(now);
        startOfToday.setHours(0, 0, 0, 0);

        const startOfWeek = new Date(startOfToday);
        const dayOfWeek = startOfWeek.getDay();
        const daysSinceMonday = (dayOfWeek + 6) % 7;
        startOfWeek.setDate(startOfWeek.getDate() - daysSinceMonday);

        const startOfMonth = new Date(
          startOfToday.getFullYear(),
          startOfToday.getMonth(),
          1
        );

        let todayCount = 0;
        let weekCount = 0;
        let monthCount = 0;

        for (const task of tasks) {
          const createdAt = task?.createdAt ? new Date(task.createdAt) : null;
          if (!createdAt || Number.isNaN(createdAt.getTime())) continue;

          if (createdAt >= startOfMonth) {
            monthCount += 1;
            if (createdAt >= startOfWeek) {
              weekCount += 1;
              if (createdAt >= startOfToday) {
                todayCount += 1;
              }
            }
          }
        }

        setTaskStats({
          today: todayCount,
          week: weekCount,
          month: monthCount,
        });
      } catch (error) {
        if (!canceled) {
          setTaskStats({ today: 0, week: 0, month: 0 });
          const message =
            error?.response?.data?.error ||
            error?.message ||
            "Failed to load task stats.";
          toast.error(message);
        }
      } finally {
        if (!canceled) {
          setTaskStatsLoading(false);
        }
      }
    };

    fetchTaskStats();

    return () => {
      canceled = true;
    };
  }, [user]);

  useEffect(() => {
    if (!user) {
      setTimeEntries([]);
      setLoadingTimeStats(false);
      return;
    }

    let canceled = false;

    const fetchTimeEntries = async () => {
      try {
        setLoadingTimeStats(true);
        const { data } = await axios.get("/api/tracker");
        if (canceled) return;
        setTimeEntries(Array.isArray(data) ? data : []);
      } catch (error) {
        if (canceled) return;
        setTimeEntries([]);
        const message =
          error?.response?.data?.error ||
          error?.message ||
          "Unable to load time stats.";
        toast.error(message);
      } finally {
        if (!canceled) {
          setLoadingTimeStats(false);
        }
      }
    };

    fetchTimeEntries();

    return () => {
      canceled = true;
    };
  }, [user]);

  const { projectDistribution, totalTrackedSeconds } = useMemo(() => {
    if (!Array.isArray(timeEntries) || timeEntries.length === 0) {
      return { projectDistribution: [], totalTrackedSeconds: 0 };
    }

    const totals = new Map();
    const now = Date.now();

    timeEntries.forEach((entry) => {
      const project = entry?.projectName?.trim() || "General";
      let seconds =
        typeof entry?.durationSec === "number" ? entry.durationSec : 0;

      if (!seconds) {
        const startMs = entry?.start ? new Date(entry.start).getTime() : NaN;
        const endMs = entry?.end ? new Date(entry.end).getTime() : NaN;

        if (entry?.isRunning && !Number.isNaN(startMs)) {
          seconds = Math.max(0, Math.floor((now - startMs) / 1000));
        } else if (!Number.isNaN(startMs) && !Number.isNaN(endMs)) {
          seconds = Math.max(0, Math.floor((endMs - startMs) / 1000));
        }
      }

      if (seconds <= 0) return;

      totals.set(project, (totals.get(project) ?? 0) + seconds);
    });

    if (!totals.size) {
      return { projectDistribution: [], totalTrackedSeconds: 0 };
    }

    const distributionEntries = Array.from(totals.entries()).map(
      ([project, seconds]) => ({
        project,
        seconds,
      })
    );

    const totalSeconds = distributionEntries.reduce(
      (acc, item) => acc + item.seconds,
      0
    );

    if (!totalSeconds) {
      return { projectDistribution: [], totalTrackedSeconds: 0 };
    }

    const distribution = distributionEntries
      .sort((a, b) => b.seconds - a.seconds)
      .map((item) => ({
        ...item,
        percentage: (item.seconds / totalSeconds) * 100,
      }));

    return {
      projectDistribution: distribution,
      totalTrackedSeconds: totalSeconds,
    };
  }, [timeEntries]);

  const donutSegments = useMemo(() => {
    if (!projectDistribution.length) return [];
    const circumference = 2 * Math.PI * chartRadius;
    let cumulativeOffset = 0;

    return projectDistribution.map((item, index) => {
      const dash = (item.percentage / 100) * circumference;
      const segment = {
        key: item.project,
        color: chartColors[index % chartColors.length],
        dashArray: `${dash} ${circumference - dash}`,
        dashOffset: -cumulativeOffset,
      };
      cumulativeOffset += dash;
      return segment;
    });
  }, [projectDistribution, chartColors, chartRadius]);

  const initials = useMemo(() => {
    if (!profile?.fullName && !profile?.username) return "";
    const source = profile?.fullName || profile.username;
    return source
      .split(" ")
      .map((chunk) => chunk[0])
      .join("")
      .slice(0, 2)
      .toUpperCase();
  }, [profile?.fullName, profile?.username]);

  const handleNameSubmit = async (event) => {
    event.preventDefault();
    const nextName = nameInput.trim();
    if (!nextName) {
      toast.error("Name cannot be empty.");
      return;
    }

    if (nextName === profile?.fullName) {
      toast.success("No changes to save.");
      return;
    }

    try {
      setUpdatingName(true);
      const { data } = await axios.patch("/api/user/update", {
        fullName: nextName,
      });
      setProfile(data);
      mergeUser({ fullName: data.fullName });
      toast.success("Name updated.");
    } catch (error) {
      const message =
        error?.response?.data?.error ||
        error?.message ||
        "Failed to update name.";
      toast.error(message);
    } finally {
      setUpdatingName(false);
    }
  };

  const handlePasswordSubmit = async (event) => {
    event.preventDefault();
    const { currentPassword, newPassword, confirmPassword } = passwordForm;

    if (!currentPassword || !newPassword || !confirmPassword) {
      toast.error("Please complete all password fields.");
      return;
    }

    if (newPassword.length < 6) {
      toast.error("New password must be at least 6 characters.");
      return;
    }

    if (newPassword !== confirmPassword) {
      toast.error("New passwords do not match.");
      return;
    }

    try {
      setUpdatingPassword(true);
      await axios.patch("/api/user/password", passwordForm);
      setPasswordForm({
        currentPassword: "",
        newPassword: "",
        confirmPassword: "",
      });
      toast.success("Password updated.");
    } catch (error) {
      const message =
        error?.response?.data?.error ||
        error?.message ||
        "Failed to update password.";
      toast.error(message);
    } finally {
      setUpdatingPassword(false);
    }
  };

  const handleDeleteAccount = async () => {
    const confirmed = window.confirm(
      "This action will permanently delete your account and associated data. Continue?"
    );
    if (!confirmed) return;

    try {
      await axios.delete("/api/user/delete");
      toast.success("Account deleted.");
      await logout();
      navigate("/", { replace: true });
    } catch (error) {
      const message =
        error?.response?.data?.error ||
        error?.message ||
        "Failed to delete account.";
      toast.error(message);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen pt-24 pb-16 px-4 sm:px-8">
        <div className="max-w-4xl mx-auto bg-gray-800/40 border border-white/10 rounded-2xl p-8 text-gray-300">
          Loading profile...
        </div>
      </div>
    );
  }

  if (!profile) {
    return (
      <div className="min-h-screen pt-24 pb-16 px-4 sm:px-8">
        <div className="max-w-4xl mx-auto bg-gray-800/40 border border-white/10 rounded-2xl p-8 text-gray-300">
          Unable to load profile information.
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen pt-24 pb-16 px-4 sm:px-8">
      <div className="max-w-5xl mx-auto space-y-8">
        <section className="bg-gray-800/50 border border-white/10 rounded-2xl p-6 sm:p-8 flex flex-col md:flex-row md:items-center md:justify-between gap-6">
          <div className="flex items-center gap-4">
            <div className="h-16 w-16 sm:h-20 sm:w-20 rounded-full bg-[#52D3D8]/10 border border-[#52D3D8]/40 flex items-center justify-center text-[#52D3D8] text-2xl font-semibold">
              {initials || <CircleUserRound className="h-10 w-10" />}
            </div>
            <div>
              <h1 className="text-2xl sm:text-3xl font-semibold text-white">
                {profile.fullName || profile.username}
              </h1>
              <p className="text-gray-300 flex items-center gap-2 mt-1">
                <UserRound className="h-4 w-4 text-[#52D3D8]" />
                {profile.username}
              </p>
              <p className="text-gray-300 flex items-center gap-2 mt-1 break-all">
                <Mail className="h-4 w-4 text-[#52D3D8]" />
                {profile.email}
              </p>
            </div>
          </div>

          <div className="bg-gray-900/60 border border-white/10 rounded-xl p-4 sm:p-5 w-full md:w-auto">
            <p className="text-sm text-gray-400 flex items-center gap-2">
              <CalendarClock className="h-4 w-4 text-[#52D3D8]" />
              Member since
            </p>
            <p className="text-lg font-medium text-white mt-1">
              {formatDate(profile.createdAt)}
            </p>
          </div>
        </section>
      
        <section className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <h2 className="col-span-full text-xl font-semibold text-white">
            Task Summary
          </h2>
          {[
            { label: "Today", value: taskStats.today },
            { label: "This Week", value: taskStats.week },
            { label: "This Month", value: taskStats.month },
          ].map((stat) => (
            <div
              key={stat.label}
              className="bg-gray-800/50 border border-white/10 rounded-2xl p-5 sm:p-6"
            >
              <p className="text-sm text-gray-400">{stat.label}</p>
              <p className="mt-2 text-3xl font-semibold text-white">
                {taskStatsLoading ? "—" : stat.value}
              </p>
              {taskStatsLoading && (
                <p className="mt-3 text-xs text-gray-500">Loading…</p>
              )}
            </div>
          ))}
        </section>

        <section className="bg-gray-800/50 border border-white/10 rounded-2xl p-6 sm:p-8 space-y-6">
          <header className="flex flex-wrap items-center justify-between gap-3">
            <h2 className="text-xl font-semibold text-white">
              Time Distribution
            </h2>
            {!loadingTimeStats && totalTrackedSeconds > 0 && (
              <p className="text-sm text-gray-400">
                Total tracked:{" "}
                <span className="font-semibold text-white">
                  {formatDuration(totalTrackedSeconds)}
                </span>
              </p>
            )}
          </header>

          {loadingTimeStats ? (
            <p className="text-sm text-gray-400">
              Loading time distribution…
            </p>
          ) : !projectDistribution.length ? (
            <p className="text-sm text-gray-400">
              No tracked time yet. Start tracking to see project breakdown.
            </p>
          ) : (
            <div className="flex flex-col gap-6 lg:flex-row lg:items-center">
              <div className="relative mx-auto h-48 w-48">
                <svg viewBox="0 0 200 200" className="h-full w-full">
                  <circle
                    cx="100"
                    cy="100"
                    r={chartRadius}
                    stroke="rgba(255,255,255,0.1)"
                    strokeWidth={chartStrokeWidth}
                    fill="none"
                  />
                  <g transform="rotate(-90 100 100)">
                    {donutSegments.map((segment) => (
                      <circle
                        key={segment.key}
                        cx="100"
                        cy="100"
                        r={chartRadius}
                        stroke={segment.color}
                        strokeWidth={chartStrokeWidth}
                        fill="none"
                        strokeDasharray={segment.dashArray}
                        strokeDashoffset={segment.dashOffset}
                        strokeLinecap="round"
                      />
                    ))}
                  </g>
                </svg>
                <div className="absolute inset-0 flex flex-col items-center justify-center text-white">
                  <span className="text-xs uppercase tracking-wide text-gray-400">
                    Total
                  </span>
                  <span className="text-lg font-semibold">
                    {formatDuration(totalTrackedSeconds)}
                  </span>
                </div>
              </div>
              <ul className="flex-1 space-y-4">
                {projectDistribution.map((item, index) => (
                  <li
                    key={item.project}
                    className="flex items-center justify-between gap-4 text-sm text-gray-300"
                  >
                    <div className="flex items-center gap-3">
                      <span
                        className="h-3 w-3 rounded-full"
                        style={{
                          backgroundColor:
                            chartColors[index % chartColors.length],
                        }}
                      />
                      <span className="font-medium text-white">
                        {item.project}
                      </span>
                    </div>
                    <div className="text-right">
                      <p className="font-semibold text-white">
                        {item.percentage.toFixed(1)}%
                      </p>
                      <p className="text-xs text-gray-400">
                        {formatDuration(item.seconds)}
                      </p>
                    </div>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </section>

        <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
          <section className="lg:col-span-3 space-y-6">
            <form
              onSubmit={handleNameSubmit}
              className="bg-gray-800/50 border border-white/10 rounded-2xl p-6 sm:p-8 space-y-6"
            >
              <header>
                <div className="flex items-center gap-3">
                  <ShieldCheck className="h-5 w-5 text-[#52D3D8]" />
                  <h2 className="text-xl font-semibold text-white">
                    Personal Details
                  </h2>
                </div>
                <p className="text-gray-400 text-sm mt-2">
                  Update how your name appears across the app.
                </p>
              </header>

              <div className="space-y-4">
                <label className="block text-sm text-gray-300">
                  Full name
                  <input
                    type="text"
                    value={nameInput}
                    onChange={(event) => setNameInput(event.target.value)}
                    className="mt-2 w-full rounded-xl bg-white/5 border border-white/10 px-4 py-3 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#52D3D8]"
                    placeholder="Your full name"
                    autoComplete="name"
                  />
                </label>
              </div>

              <button
                type="submit"
                disabled={updatingName}
                className="inline-flex items-center gap-2 rounded-xl bg-[#52D3D8] px-5 py-3 font-semibold text-slate-900 transition hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-60"
              >
                <RefreshCcw className="h-4 w-4" />
                {updatingName ? "Saving..." : "Save changes"}
              </button>
            </form>

            <form
              onSubmit={handlePasswordSubmit}
              className="bg-gray-800/50 border border-white/10 rounded-2xl p-6 sm:p-8 space-y-6"
            >
              <header>
                <div className="flex items-center gap-3">
                  <ShieldCheck className="h-5 w-5 text-[#52D3D8]" />
                  <h2 className="text-xl font-semibold text-white">
                    Password
                  </h2>
                </div>
                <p className="text-gray-400 text-sm mt-2">
                  Use a strong password to keep your account secure.
                </p>
              </header>

              <div className="space-y-4">
                <label className="block text-sm text-gray-300">
                  Current password
                  <input
                    type="password"
                    value={passwordForm.currentPassword}
                    onChange={(event) =>
                      setPasswordForm((prev) => ({
                        ...prev,
                        currentPassword: event.target.value,
                      }))
                    }
                    className="mt-2 w-full rounded-xl bg-white/5 border border-white/10 px-4 py-3 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#52D3D8]"
                    placeholder="••••••••"
                    autoComplete="current-password"
                  />
                </label>

                <label className="block text-sm text-gray-300">
                  New password
                  <input
                    type="password"
                    value={passwordForm.newPassword}
                    onChange={(event) =>
                      setPasswordForm((prev) => ({
                        ...prev,
                        newPassword: event.target.value,
                      }))
                    }
                    className="mt-2 w-full rounded-xl bg-white/5 border border-white/10 px-4 py-3 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#52D3D8]"
                    placeholder="••••••••"
                    autoComplete="new-password"
                  />
                </label>

                <label className="block text-sm text-gray-300">
                  Confirm new password
                  <input
                    type="password"
                    value={passwordForm.confirmPassword}
                    onChange={(event) =>
                      setPasswordForm((prev) => ({
                        ...prev,
                        confirmPassword: event.target.value,
                      }))
                    }
                    className="mt-2 w-full rounded-xl bg-white/5 border border-white/10 px-4 py-3 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#52D3D8]"
                    placeholder="••••••••"
                    autoComplete="new-password"
                  />
                </label>
              </div>

              <button
                type="submit"
                disabled={updatingPassword}
                className="inline-flex items-center gap-2 rounded-xl bg-white/10 px-5 py-3 font-semibold text-white transition hover:bg-white/20 disabled:cursor-not-allowed disabled:opacity-60"
              >
                <ShieldCheck className="h-4 w-4 text-[#52D3D8]" />
                {updatingPassword ? "Updating..." : "Update password"}
              </button>
            </form>
          </section>

          <aside className="lg:col-span-2 space-y-6">
            <div className="bg-gray-800/50 border border-white/10 rounded-2xl p-6 sm:p-8 space-y-4">
              <h3 className="text-lg font-semibold text-white">Account</h3>
              <ul className="space-y-3 text-gray-300 text-sm">
                <li className="flex items-center gap-2">
                  <Mail className="h-4 w-4 text-[#52D3D8]" />
                  {profile.email}
                </li>
                <li className="flex items-center gap-2">
                  <UserRound className="h-4 w-4 text-[#52D3D8]" />
                  @{profile.username}
                </li>
                <li className="flex items-center gap-2">
                  <CalendarClock className="h-4 w-4 text-[#52D3D8]" />
                  Joined {formatDate(profile.createdAt)}
                </li>
              </ul>
            </div>

            <div className="bg-gray-800/50 border border-red-500/20 rounded-2xl p-6 sm:p-8 space-y-4">
              <h3 className="text-lg font-semibold text-red-200">
                Danger zone
              </h3>
              <p className="text-sm text-gray-300">
                Deleting your account removes tasks, trackers, and personal
                data. This action cannot be undone.
              </p>
              <button
                onClick={handleDeleteAccount}
                className="inline-flex items-center gap-2 rounded-xl border border-red-400/60 px-5 py-3 font-semibold text-red-200 transition hover:bg-red-500/10"
              >
                <Trash2 className="h-4 w-4" />
                Delete account
              </button>
            </div>
          </aside>
        </div>
      </div>
    </div>
  );
};

export default Profile;
