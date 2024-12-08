const keyBackspace = "Backspace";
const keyEnter = "Enter";

const elementIdUserCommandInput = "user-command-input";
const elementIdUserCommandOutput = "user-command-output";

const revealYourSecrets = "reveal your secrets";

const commandGit = "git";
const commandList = "ls";
const commandDate = "date";
const commandCat = "cat";
const commandHelp = "help";
const commandWhoami = "whoami";
const commandExit = "exit";
const commandClear = "clear";
const commandEcho = "echo";
const commandPrintf = "printf";
const unsupportedCommands = [
    "cd",
    "pwd",
    "mkdir",
    "rmdir",
    "rm",
    "cp",
    "mv",
    "touch",
    "find",
    "less",
    "head",
    "tail",
    "nano",
    "chmod",
    "chown",
    "stat",
    "export",
    "ps",
    "top",
    "htop",
    "kill",
    "killall",
    "curl",
    "ping",
    "wget",
    "netstat",
    "ifconfig",
    "tar",
    "gzip",
    "zip",
    "unzip",
    "gunzip",
    "uptime",
    "man",
    "alias",
    "history",
    "sudo",
];

const scope = {};

function getUserCommandInputElement() {
    return document.getElementById(elementIdUserCommandInput);
}

function setUserCommandOutput(output) {
    document.getElementById(elementIdUserCommandOutput).innerText = output;
}

function appendCommandCharacter(key) {
    if (key == " ") {
        getUserCommandInputElement().innerHTML += "&nbsp;";
    } else {
        getUserCommandInputElement().innerText += key;
    }
}

function submitCommand() {
    const inputElement = getUserCommandInputElement();
    let command = inputElement.innerText.trim().toLowerCase();
    const commandTokens = command.split(" ");

    inputElement.innerText = "";
    setUserCommandOutput("");

    command = commandTokens.join(" ")
    if (command === "") {
        return;
    }

    if (command === revealYourSecrets) {
        handleRevealYourSecrets();

        return;
    }

    if (handleFakeShellCommand(commandTokens)) {
        return;
    }

    try {
        const output = math.evaluate(command, scope);

        setUserCommandOutput(output);
    } catch (exception) {
        setUserCommandOutput(exception);
    }
}

function handleFakeShellCommand(commandTokens) {
    const binary = commandTokens[0];

    switch (binary) {
        case commandList:
            handleListCommand(commandTokens);
            return true;
        case commandDate:
            handleDateCommand();
            return true;
        case commandCat:
            handleCatCommand(commandTokens);
            return true;
        case commandHelp:
            handleHelpCommand();
            return true;
        case commandWhoami:
            handleWhoamiCommand();
            return true;
        case commandGit:
            handleGitCommand(commandTokens);
            return true;
        case commandExit:
            return true;
        case commandClear:
            return true;
        case commandEcho:
        case commandPrintf:
            handleEchoCommand(commandTokens);
            return true;
        default:
            if (unsupportedCommands.includes(binary)) {
                handleCommandNotFound(binary);
                return true;
            }

            return false;
    }
}

function handleCommandNotFound(binary) {
    setUserCommandOutput(`Command '${binary}' not found`);
}

function handleEchoCommand(commandTokens) {
    const arguments = commandTokens.slice(1).join(" ");

    setUserCommandOutput(arguments);
}

function handleHelpCommand() {
    setUserCommandOutput("Input any math expression or try `ls`, `echo`, `cat`, etc.");
}

function handleRevealYourSecrets() {
    setUserCommandOutput("Pray, attempt to summon `help` with thy enchanted wand.");
}

function handleWhoamiCommand() {
    setUserCommandOutput("Maksym Kryvchun");
}

function handleDateCommand() {
    setUserCommandOutput((new Date()).getFullYear());
}


function handleGitCommand(commandTokens) {
    const arguments = commandTokens.slice(1).join(" ");

    if (arguments == "remote get-url origin") {
        setUserCommandOutput("https://github.com/hedhyw");

        return;
    }

    setUserCommandOutput(`git: '${arguments}' is not a git command.`);
}

function handleCatCommand(commandTokens) {
    if (commandTokens.length === 1) {
        setUserCommandOutput("cat: '': No such file or directory");

        return;
    }

    const arguments = commandTokens.slice(1).join(" ");
    const sanitizedPath = sanitizePath(arguments)

    if (sanitizedPath === "games") {
        setUserCommandOutput("cat: games: Is a directory");

        return;
    }

    if (sanitizedPath === "linkedintxt") {
        setUserCommandOutput("https://www.linkedin.com/in/hedhyw");

        return;
    }

    if (sanitizedPath === "gameshttpsrightanglehedhywcom") {
        setUserCommandOutput("https://rightangle.hedhyw.com");

        return;
    }

    setUserCommandOutput(`cat: '${arguments}': No such file or directory`);
}

function handleListCommand(commandTokens) {
    if (commandTokens.length === 1 || commandTokens[1] == "~" || commandTokens[1] == ".") {
        setUserCommandOutput("games linkedin.txt");

        return;
    }

    const arguments = commandTokens.slice(1).join(" ");


    if (sanitizePath(arguments) === "games") {
        setUserCommandOutput("https://rightangle.hedhyw.com");

        return;
    }

    setUserCommandOutput(`ls: cannot access '${arguments}': No such file or directory`);
}

function sanitizePath(path) {
    return path.replaceAll(".", "").replaceAll("~", "").replaceAll("/", "").replaceAll("\\", "").replaceAll(":", "");
}

window.addEventListener("keypress", (event) => {
    if (event.key == keyEnter) {
        submitCommand();
    } else {
        appendCommandCharacter(event.key);
    }
});

window.addEventListener("keydown", (event) => {
    const inputElement = getUserCommandInputElement();

    if (event.key == keyBackspace) {
        inputElement.innerText = inputElement.innerText.slice(0, -1);
    }
});
