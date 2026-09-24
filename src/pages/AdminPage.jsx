import {
  useCallback,
  useEffect,
  useState,
} from "react";

import "./AdminPage.css";
import Navbar from "../components/Navbar/Navbar";

const API_URL =
  import.meta.env.VITE_API_URL ||
  "http://localhost:4000";


const AdminPage = () => {

  const [sync, setSync] =
    useState(null);

  const [stats, setStats] =
    useState({
      anime: 0,
      episodes: 0,
    });

  const [starting, setStarting] =
    useState(false);


  // ---------------------------------------------
  // FETCH SYNC STATUS
  // ---------------------------------------------

  const fetchSyncStatus =
    useCallback(async () => {

      try {

        const response =
          await fetch(
            `${API_URL}/api/admin/sync/status`,
            {
              credentials: "include",
            }
          );


        // ---------------------------------------
        // SESSION EXPIRED / NOT AUTHENTICATED
        // ---------------------------------------

        if (response.status === 401) {

          window.location.href =
            "/admin/login";

          return null;
        }


        const data =
          await response.json();


        if (data.ok) {

          setSync(data);

          return data;
        }


        return null;

      } catch (error) {

        console.error(
          "Failed to fetch sync status:",
          error
        );

        return null;
      }

    }, []);


  // ---------------------------------------------
  // FETCH DATABASE STATS
  // ---------------------------------------------

  const fetchStats =
    useCallback(async () => {

      try {

        const response =
          await fetch(
            `${API_URL}/api/admin/stats`,
            {
              credentials: "include",
            }
          );


        // ---------------------------------------
        // SESSION EXPIRED / NOT AUTHENTICATED
        // ---------------------------------------

        if (response.status === 401) {

          window.location.href =
            "/admin/login";

          return null;
        }


        const data =
          await response.json();


        if (data.ok) {

          setStats({
            anime: data.anime,
            episodes: data.episodes,
          });

          return data;
        }


        return null;

      } catch (error) {

        console.error(
          "Failed to fetch stats:",
          error
        );

        return null;
      }

    }, []);


  // ---------------------------------------------
  // INITIAL LOAD
  // ---------------------------------------------

  useEffect(() => {

    let cancelled = false;


    const loadAdminData =
      async () => {

        try {

          const [
            syncResponse,
            statsResponse,
          ] = await Promise.all([

            fetch(
              `${API_URL}/api/admin/sync/status`,
              {
                credentials:
                  "include",
              }
            ),

            fetch(
              `${API_URL}/api/admin/stats`,
              {
                credentials:
                  "include",
              }
            ),

          ]);


          // Component was unmounted

          if (cancelled) {
            return;
          }


          // -------------------------------------
          // CHECK AUTHENTICATION
          // -------------------------------------

          if (
            syncResponse.status ===
            401
          ) {

            window.location.href =
              "/admin/login";

            return;
          }


          // -------------------------------------
          // READ RESPONSES
          // -------------------------------------

          const syncData =
            await syncResponse.json();

          const statsData =
            await statsResponse.json();


          // -------------------------------------
          // SET SYNC DATA
          // -------------------------------------

          if (syncData.ok) {

            setSync(syncData);
          }


          // -------------------------------------
          // SET DATABASE STATS
          // -------------------------------------

          if (statsData.ok) {

            setStats({
              anime:
                statsData.anime,

              episodes:
                statsData.episodes,
            });
          }

        } catch (error) {

          if (!cancelled) {

            console.error(
              "Failed to load admin data:",
              error
            );
          }
        }
      };


    loadAdminData();


    return () => {

      cancelled = true;

    };

  }, []);


  // ---------------------------------------------
  // LIVE STATUS POLLING
  // ---------------------------------------------

  useEffect(() => {

    // Don't start polling unless
    // sync is currently running.

    if (
      sync?.status !==
      "running"
    ) {
      return;
    }


    const interval =
      setInterval(
        async () => {

          const data =
            await fetchSyncStatus();


          if (!data) {
            return;
          }


          // -------------------------------------
          // SYNC FINISHED
          // -------------------------------------

          if (
            data.status ===
              "completed" ||
            data.status ===
              "failed"
          ) {

            await fetchStats();
          }

        },
        1000
      );


    // -----------------------------------------
    // CLEANUP
    // -----------------------------------------

    return () => {

      clearInterval(interval);

    };

  }, [
    sync?.status,
    fetchSyncStatus,
    fetchStats,
  ]);


  // ---------------------------------------------
  // START MAJOR SYNC
  // ---------------------------------------------

  const handleMajorSync =
    async () => {

      // Don't start another sync
      // while one is already running.

      if (
        sync?.status ===
        "running"
      ) {
        return;
      }


      setStarting(true);


      try {

        const response =
          await fetch(
            `${API_URL}/api/admin/sync/major`,
            {
              method: "POST",

              credentials:
                "include",
            }
          );


        // ---------------------------------------
        // SESSION EXPIRED
        // ---------------------------------------

        if (
          response.status ===
          401
        ) {

          window.location.href =
            "/admin/login";

          return;
        }


        const data =
          await response.json();


        // ---------------------------------------
        // SERVER ERROR
        // ---------------------------------------

        if (!response.ok) {

          alert(
            data.message ||
            "Failed to start sync."
          );

          return;
        }


        // ---------------------------------------
        // GET RUNNING STATUS
        // ---------------------------------------

        await fetchSyncStatus();

      } catch (error) {

        console.error(
          "Start sync error:",
          error
        );

        alert(
          "Failed to start major sync."
        );

      } finally {

        setStarting(false);
      }
    };


  // ---------------------------------------------
  // ADMIN LOGOUT
  // ---------------------------------------------

  const handleLogout =
    async () => {

      try {

        await fetch(
          `${API_URL}/api/admin/auth/logout`,
          {
            method: "POST",

            credentials:
              "include",
          }
        );

      } catch (error) {

        console.error(
          "Logout error:",
          error
        );

      } finally {

        window.location.href =
          "/admin/login";
      }
    };


  // ---------------------------------------------
  // PROGRESS
  // ---------------------------------------------

  const progress =
    sync?.total > 0
      ? Math.min(
          100,
          Math.round(
            (sync.current /
              sync.total) *
              100
          )
        )
      : 0;


  // ---------------------------------------------
  // STATUS
  // ---------------------------------------------

  const isRunning =
    sync?.status ===
    "running";

  const isCompleted =
    sync?.status ===
    "completed";

  const isFailed =
    sync?.status ===
    "failed";


  // ---------------------------------------------
  // UI
  // ---------------------------------------------

  return (
    <div className="admin-page">

      {/* -------------------------------- */}
      {/* NAVBAR */}
      {/* -------------------------------- */}

      <Navbar />


      {/* -------------------------------- */}
      {/* HEADER */}
      {/* -------------------------------- */}

      <div className="admin-header">

        <div>

          <h1>
            Admin Panel
          </h1>

          <p>
            Anime database
            synchronization
          </p>


          <button
            type="button"
            onClick={handleLogout}
            className="admin-logout-button"
          >
            Logout
          </button>

        </div>


        <div
          className={
            `sync-status-badge ${
              sync?.status ||
              "idle"
            }`
          }
        >

          <span
            className="status-dot"
          ></span>


          {sync?.status ||
            "idle"}

        </div>

      </div>


      {/* -------------------------------- */}
      {/* DATABASE STATS */}
      {/* -------------------------------- */}

      <div className="admin-stats">

        <div className="admin-stat-card">

          <span>
            Total Anime
          </span>

          <strong>
            {stats.anime.toLocaleString()}
          </strong>

        </div>


        <div className="admin-stat-card">

          <span>
            Total Episodes
          </span>

          <strong>
            {stats.episodes.toLocaleString()}
          </strong>

        </div>


        <div className="admin-stat-card">

          <span>
            Synced
          </span>

          <strong>
            {sync?.synced || 0}
          </strong>

        </div>


        <div className="admin-stat-card">

          <span>
            Failed
          </span>

          <strong>
            {sync?.failed || 0}
          </strong>

        </div>

      </div>


      {/* -------------------------------- */}
      {/* SYNC CONTROL */}
      {/* -------------------------------- */}

      <section className="sync-panel">

        <div className="sync-panel-header">

          <div>

            <h2>
              Major Sync
            </h2>

            <p>
              Synchronize all anime
              from the API.
            </p>

          </div>


          <button
            className="sync-button"
            onClick={
              handleMajorSync
            }
            disabled={
              isRunning ||
              starting
            }
          >

            {isRunning
              ? "Sync Running..."
              : starting
                ? "Starting..."
                : "Start Major Sync"}

          </button>

        </div>


        {/* -------------------------------- */}
        {/* PROGRESS INFORMATION */}
        {/* -------------------------------- */}

        <div className="sync-progress-section">

          <div className="progress-info">

            <span>
              Page
            </span>

            <strong>
              {sync?.page || 0}
            </strong>

          </div>


          <div className="progress-info">

            <span>
              Current
            </span>

            <strong>

              {sync?.current || 0}

              {" / "}

              {sync?.total || 0}

            </strong>

          </div>


          <div className="progress-info">

            <span>
              Synced
            </span>

            <strong>
              {sync?.synced || 0}
            </strong>

          </div>


          <div className="progress-info">

            <span>
              Failed
            </span>

            <strong>
              {sync?.failed || 0}
            </strong>

          </div>

        </div>


        {/* -------------------------------- */}
        {/* PROGRESS BAR */}
        {/* -------------------------------- */}

        <div className="progress-bar-container">

          <div
            className="progress-bar"
            style={{
              width:
                `${progress}%`,
            }}
          />

        </div>


        <div className="progress-percentage">

          {progress}%

        </div>


        {/* -------------------------------- */}
        {/* CURRENT ANIME */}
        {/* -------------------------------- */}

        <div className="current-anime">

          <span>
            Current Anime
          </span>


          {sync?.currentAnime ? (

            <div>

              <strong>
                {
                  sync.currentAnime
                    .title
                }
              </strong>

              <small>
                ID:{" "}
                {
                  sync.currentAnime
                    .id
                }
              </small>

            </div>

          ) : (

            <strong>

              {isCompleted
                ? "Sync completed"
                : "No anime currently syncing"}

            </strong>

          )}

        </div>


        {/* -------------------------------- */}
        {/* MESSAGE */}
        {/* -------------------------------- */}

        <div
          className={
            `sync-message ${
              sync?.status ||
              "idle"
            }`
          }
        >

          {
            sync?.message ||
            "No synchronization has been performed yet."
          }

        </div>


        {/* -------------------------------- */}
        {/* RESULT */}
        {/* -------------------------------- */}

        {isCompleted && (

          <div className="sync-result">

            <div>

              <span>
                Successfully synced
              </span>

              <strong>
                {sync.synced}
              </strong>

            </div>


            <div>

              <span>
                Failed
              </span>

              <strong>
                {sync.failed}
              </strong>

            </div>

          </div>

        )}


        {/* -------------------------------- */}
        {/* ERROR */}
        {/* -------------------------------- */}

        {isFailed && (

          <div className="sync-error">

            {sync.message}

          </div>

        )}

      </section>

    </div>
  );
};


export default AdminPage;