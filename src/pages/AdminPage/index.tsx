import { FC, CSSProperties, useEffect, useMemo, useState } from "react";
import { Navigate } from "react-router-dom";
import { useTranslation } from "react-i18next";

import Avatar from "../../components/Avatar";
import Title from "../../components/Title";
import { getRoleSrc } from "../../utils/roleAssets";
import { toRoleKey } from "../../hooks/useMultiplayerViewer";
import { useMeQuery } from "../../store/api/authApi";
import {
  useAdminUsersQuery,
  useUserGamesQuery,
  useRoleWeightsQuery,
  useUpdateRoleWeightsMutation,
  type AdminUser,
  type RoleWeight,
} from "../../store/api/adminApi";
import type { PlayerRole } from "../../store/multiplayerSlice";

import "./index.scss";

const ROLE_ORDER: PlayerRole[] = ["INNOCENT", "SHERIFF", "DOCTOR", "PUTANA", "MAFIA", "DON"];
// Slider expresses a likelihood multiplier as a percentage; 100% = neutral.
const PCT_MIN = 0;
const PCT_MAX = 300;
const weightToPct = (w: number) => Math.round(w * 100);
const pctToWeight = (p: number) => p / 100;

const winrate = (u: AdminUser) => (u.gamesPlayed ? Math.round((u.wins / u.gamesPlayed) * 100) : 0);

const GameHistory: FC<{ userId: string }> = ({ userId }) => {
  const { t, i18n } = useTranslation();
  const { data: games, isLoading } = useUserGamesQuery(userId);

  if (isLoading) return <p className="admin-doss__muted">{t("admin.loading")}</p>;
  if (!games || games.length === 0) return <p className="admin-doss__muted">{t("admin.noGames")}</p>;

  return (
    <ol className="admin-ledger">
      {games.map((g) => {
        const key = toRoleKey(g.role);
        const date = g.finishedAt ? new Date(g.finishedAt).toLocaleDateString(i18n.language) : "—";
        return (
          <li key={g.gameId} className={`admin-ledger__row admin-ledger__row--${g.won ? "win" : "loss"}`}>
            <span className="admin-ledger__mark">{g.won ? "W" : "L"}</span>
            {key ? <img className="admin-ledger__role" src={getRoleSrc(key)} alt="" /> : null}
            <span className="admin-ledger__name">{t(`multiplayer.role.${g.role}`)}</span>
            <span className="admin-ledger__date">{date}</span>
            <span className={`admin-ledger__delta admin-ledger__delta--${g.ratingDelta >= 0 ? "up" : "down"}`}>
              {g.ratingDelta >= 0 ? "+" : ""}
              {g.ratingDelta}
            </span>
          </li>
        );
      })}
    </ol>
  );
};

const ChancesEditor: FC<{ userId: string }> = ({ userId }) => {
  const { t } = useTranslation();
  const { data: weights } = useRoleWeightsQuery(userId);
  const [updateRoleWeights, { isLoading }] = useUpdateRoleWeightsMutation();
  const [draft, setDraft] = useState<Record<string, number>>({});

  useEffect(() => {
    if (weights) setDraft(Object.fromEntries(weights.map((w) => [w.role, weightToPct(w.weight)])));
  }, [weights]);

  if (!weights) return <p className="admin-doss__muted">{t("admin.loading")}</p>;

  const dirty = weights.some((w) => weightToPct(w.weight) !== (draft[w.role] ?? 100));

  const set = (role: string, pct: number) =>
    setDraft((d) => ({ ...d, [role]: Math.max(PCT_MIN, Math.min(PCT_MAX, pct)) }));

  const save = () => {
    const payload: RoleWeight[] = ROLE_ORDER.map((role) => ({
      role,
      weight: pctToWeight(Number.isFinite(draft[role]) ? draft[role] : 100),
    }));
    void updateRoleWeights({ userId, weights: payload });
  };

  const reset = () => setDraft(Object.fromEntries(ROLE_ORDER.map((r) => [r, 100])));

  return (
    <div className="admin-chances">
      {ROLE_ORDER.map((role) => {
        const key = toRoleKey(role);
        const pct = draft[role] ?? 100;
        const fill = (pct / PCT_MAX) * 100;
        const tone = pct > 100 ? "up" : pct < 100 ? "down" : "neutral";
        return (
          <div key={role} className={`admin-chance admin-chance--${tone}`}>
            <div className="admin-chance__head">
              {key ? <img className="admin-chance__icon" src={getRoleSrc(key)} alt="" /> : null}
              <span className="admin-chance__name">{t(`multiplayer.role.${role}`)}</span>
              <span className="admin-chance__pct">{pct}%</span>
            </div>
            <div className="admin-chance__track" style={{ "--fill": `${fill}%` } as CSSProperties}>
              <span className="admin-chance__baseline" />
              <input
                type="range"
                min={PCT_MIN}
                max={PCT_MAX}
                step={5}
                value={pct}
                onChange={(e) => set(role, Number(e.target.value))}
                aria-label={t(`multiplayer.role.${role}`)}
              />
            </div>
          </div>
        );
      })}
      <div className="admin-chances__actions">
        <button type="button" className="button button--outline" onClick={reset}>
          {t("admin.reset")}
        </button>
        <button type="button" className="button button--primary" onClick={save} disabled={isLoading || !dirty}>
          {t("admin.save")}
        </button>
      </div>
    </div>
  );
};

const AdminPage: FC = () => {
  const { t } = useTranslation();
  const { data: me, isLoading: meLoading } = useMeQuery();
  const { data: users } = useAdminUsersQuery(undefined, { skip: !me?.isAdmin });
  const [selectedId, setSelectedId] = useState<string | null>(null);

  useEffect(() => {
    document.title = t("admin.title");
  }, [t]);

  // Default to the first player once the roster loads.
  useEffect(() => {
    if (!selectedId && users && users.length > 0) setSelectedId(users[0].id);
  }, [users, selectedId]);

  const selected = useMemo(() => users?.find((u) => u.id === selectedId) ?? null, [users, selectedId]);

  if (meLoading) return null;
  if (!me?.isAdmin) return <Navigate to="/profile" replace />;

  return (
    <section className="admin">
      <header className="admin__masthead">
        <Title className="admin__title" text={t("admin.title")} />
        <p className="admin__hint">{t("admin.hint")}</p>
      </header>

      <div className="admin__grid">
        <aside className="admin__roster">
          <div className="admin__roster-label">{t("admin.roster", { count: users?.length ?? 0 })}</div>
          <ul className="admin__roster-list">
            {users?.map((u) => (
              <li key={u.id}>
                <button
                  type="button"
                  className={`admin-card${selectedId === u.id ? " admin-card--active" : ""}`}
                  onClick={() => setSelectedId(u.id)}
                >
                  <Avatar username={u.username} avatarUrl={u.avatarUrl} size="sm" />
                  <span className="admin-card__body">
                    <span className="admin-card__name">{u.username}</span>
                    <span className="admin-card__meta">
                      {u.rating} · {u.gamesPlayed} {t("admin.games")}
                    </span>
                  </span>
                  {u.isAdmin ? <span className="admin-card__badge">{t("admin.adminTag")}</span> : null}
                </button>
              </li>
            ))}
          </ul>
        </aside>

        <main className="admin__dossier">
          {selected ? (
            <>
              <div className="admin-doss__header">
                <Avatar username={selected.username} avatarUrl={selected.avatarUrl} size="lg" />
                <div className="admin-doss__id">
                  <h2 className="admin-doss__name">{selected.username}</h2>
                  <p className="admin-doss__email">{selected.email ?? t("admin.noEmail")}</p>
                </div>
                {selected.isAdmin ? <span className="admin-doss__tag">{t("admin.adminTag")}</span> : null}
              </div>

              <div className="admin-stats">
                <div className="admin-stat admin-stat--accent">
                  <span className="admin-stat__value">{selected.rating}</span>
                  <span className="admin-stat__label">{t("admin.rating")}</span>
                </div>
                <div className="admin-stat">
                  <span className="admin-stat__value">{selected.gamesPlayed}</span>
                  <span className="admin-stat__label">{t("admin.gamesLabel")}</span>
                </div>
                <div className="admin-stat">
                  <span className="admin-stat__value admin-stat__value--win">{selected.wins}</span>
                  <span className="admin-stat__label">{t("admin.wins")}</span>
                </div>
                <div className="admin-stat">
                  <span className="admin-stat__value admin-stat__value--loss">{selected.losses}</span>
                  <span className="admin-stat__label">{t("admin.losses")}</span>
                </div>
                <div className="admin-stat">
                  <span className="admin-stat__value">{winrate(selected)}%</span>
                  <span className="admin-stat__label">{t("admin.winrate")}</span>
                </div>
              </div>

              <div className="admin-doss__cols">
                <section className="admin-panel">
                  <h3 className="admin-panel__title">{t("admin.history")}</h3>
                  <GameHistory userId={selected.id} />
                </section>
                <section className="admin-panel">
                  <h3 className="admin-panel__title">{t("admin.chances")}</h3>
                  <p className="admin-panel__sub">{t("admin.chancesHint")}</p>
                  <ChancesEditor userId={selected.id} />
                </section>
              </div>
            </>
          ) : (
            <p className="admin-doss__muted">{t("admin.selectUser")}</p>
          )}
        </main>
      </div>
    </section>
  );
};

export default AdminPage;
