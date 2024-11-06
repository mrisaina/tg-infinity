import fetch from "node-fetch";
import dotenv from "dotenv";
dotenv.config();

const username = process.env.PYTHONANYWHERE_USERNAME;
const token = process.env.PYTHONANYWHERE_TOKEN;
const fileName = `/home/${username}/tg-bot-inf.py`;

async function getConsoles() {
  const url = `https://www.pythonanywhere.com/api/v0/user/${username}/consoles/`;

  try {
    const response = await fetch(url, {
      method: "GET",
      headers: {
        Authorization: `Token ${token}`,
      },
    });

    if (!response.ok) {
      throw new Error(`Failed to fetch consoles: ${response.status}`);
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Error fetching consoles:", error);
    return null;
  }
}

async function deleteConsole(consoleId) {
  const url = `https://www.pythonanywhere.com/api/v0/user/${username}/consoles/${consoleId}/`;

  try {
    const response = await fetch(url, {
      method: "DELETE",
      headers: {
        Authorization: `Token ${token}`,
      },
    });

    if (response.status === 204) {
      console.log(`Console with ID ${consoleId} deleted successfully.`);
    } else {
      throw new Error(`Failed to delete console: ${response.status}`);
    }
  } catch (error) {
    console.error("Error deleting console:", error);
  }
}

async function runFileOnPythonAnywhere() {
  const url = `https://www.pythonanywhere.com/api/v0/user/${username}/consoles/`;

  try {
    const response = await fetch(url, {
      method: "POST",
      headers: {
        Authorization: `Token ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        executable: "python3.10",
        arguments: fileName,
        working_directory: `/home/${username}`,
      }),
    });

    if (!response.ok) {
      throw new Error(`Failed to start console: ${response.status}`);
    }

    const data = await response.json();
    console.log(`Console started with ID: ${data.id}`);
    return data.id; // Returns the ID of the new console
  } catch (error) {
    console.error("Error starting console:", error);
    return null;
  }
}

async function getConsoleStatus(consoleId) {
  const url = `https://www.pythonanywhere.com/api/v0/user/${username}/consoles/${consoleId}/`;

  try {
    const response = await fetch(url, {
      method: "GET",
      headers: {
        Authorization: `Token ${token}`,
      },
    });

    if (!response.ok) {
      throw new Error(`Failed to fetch console status: ${response.status}`);
    }

    const data = await response.json();
    console.log(`Console status for ID ${consoleId}:`, data);
    return data;
  } catch (error) {
    console.error("Error fetching console status:", error);
    return null;
  }
}

async function runScriptInConsole(consoleId) {
  const url = `https://www.pythonanywhere.com/api/v0/user/${username}/consoles/${consoleId}/run/`;

  try {
    const response = await fetch(url, {
      method: "POST",
      headers: {
        Authorization: `Token ${token}`,
        "Content-Type": "application/json",
      },
    });

    if (!response.ok) {
      throw new Error(`Failed to run script in console: ${response.status}`);
    }

    console.log(`Script started in console with ID ${consoleId}.`);
  } catch (error) {
    console.error("Error running script in console:", error);
  }
}

function wait(seconds) {
  return new Promise((resolve) => setTimeout(resolve, seconds * 1000));
}

(async () => {
  const consoles = await getConsoles();

  if (consoles && consoles.length > 0) {
    const firstConsoleId = consoles[0].id;
    await deleteConsole(firstConsoleId);
  } else {
    console.log("No consoles to delete.");
  }

  const newConsoleId = await runFileOnPythonAnywhere();
  console.log(newConsoleId);

  if (newConsoleId) {
    await runScriptInConsole(newConsoleId);
  }

  console.log("Waiting for 4-5 seconds...");
  await wait(5);
})();
