// Add JS here

async function initCrazyGamesSDK() {
  if (window.CrazyGames && window.CrazyGames.SDK) {
    try {
      await window.CrazyGames.SDK.init();
      console.log("CrazyGames SDK initialized successfully.");
    } catch (error) {
      console.error("CrazyGames SDK initialization failed: ", error);
    }
  }
}

initCrazyGamesSDK();