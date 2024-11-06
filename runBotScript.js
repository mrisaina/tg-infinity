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
  const command = `python3.10 ${fileName}`;

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

(async () => {
  const consoles = await getConsoles();

  if (consoles && consoles.length > 0) {
    console.log(consoles);
    const firstConsoleId = consoles[0].id;
    await deleteConsole(firstConsoleId);
  } else {
    console.log("No consoles to delete.");
  }

  await runFileOnPythonAnywhere();
})();
