# Playwright with Python: A Guide for JS/TS Automation QAs

> **Audience:** You already know Playwright with JavaScript/TypeScript (locators, fixtures, `page.click()`, assertions, the test runner, CI). This guide maps that knowledge onto Playwright for Python so you can become productive fast, without re-learning Playwright's concepts from zero — just the Python-shaped syntax around them.

---

## Table of Contents

1. [Two Flavors of Playwright Python](#1-two-flavors-of-playwright-python)
2. [Installation & Project Setup](#2-installation--project-setup)
3. [Project Structure](#3-project-structure)
4. [Sync vs Async API](#4-sync-vs-async-api)
5. [Core Concept Mapping: JS → Python](#5-core-concept-mapping-js--python)
6. [Locators & Actions](#6-locators--actions)
7. [Assertions (`expect`)](#7-assertions-expect)
8. [Writing Tests with Pytest](#8-writing-tests-with-pytest)
9. [Fixtures: JS Fixtures vs Pytest Fixtures](#9-fixtures-js-fixtures-vs-pytest-fixtures)
10. [Page Object Model in Python](#10-page-object-model-in-python)
11. [Configuration (`pytest.ini` / `conftest.py` vs `playwright.config.js`)](#11-configuration-pytestini--conftestpy-vs-playwrightconfigjs)
12. [Running Tests: CLI Cheat Sheet](#12-running-tests-cli-cheat-sheet)
13. [Parallelism, Retries, Tags](#13-parallelism-retries-tags)
14. [Tracing, Screenshots, Video, Reports](#14-tracing-screenshots-video-reports)
15. [API Testing](#15-api-testing)
16. [CI Integration (GitHub Actions)](#16-ci-integration-github-actions)
17. [Common Gotchas for JS Devs](#17-common-gotchas-for-js-devs)
18. [Quick Reference Cheat Sheet](#18-quick-reference-cheat-sheet)
19. [Practice Exercises](#19-practice-exercises)
20. [Further Reading](#20-further-reading)

---

## 1. Two Flavors of Playwright Python

Unlike Playwright JS (which has one API surface built around `async/await`), Playwright Python ships **two APIs**:

| Flavor | Import | When to use |
|---|---|---|
| **Sync API** | `from playwright.sync_api import sync_playwright, expect` | Default for test automation. Used automatically by `pytest-playwright`. Reads like normal top-to-bottom code — no `await`. |
| **Async API** | `from playwright.async_api import async_playwright, expect` | Use only if your project already uses `asyncio` (e.g. mixing with `httpx`, FastAPI test clients, or async frameworks). |

**Rule of thumb:** as a QA writing test suites, you will use the **sync API** ~95% of the time via `pytest-playwright`. This guide focuses on that, with async noted where relevant.

---

## 2. Installation & Project Setup

In JS you did:

```bash
npm init playwright@latest
```

In Python, the equivalent flow:

```bash
# 1. Create & activate a virtual environment (Python's equivalent of node_modules isolation)
python -m venv .venv
.venv\Scripts\activate        # Windows
# source .venv/bin/activate    # macOS/Linux

# 2. Install Playwright + the pytest plugin
pip install pytest-playwright

# 3. Install browser binaries (same concept as `npx playwright install`)
playwright install

# 4. (Optional) install OS dependencies on Linux CI
playwright install --with-deps
```

Freeze your dependencies (Python's `package-lock.json` equivalent):

```bash
pip freeze > requirements.txt
```

Others then set up the project with:

```bash
pip install -r requirements.txt
playwright install
```

| JS/npm | Python/pip |
|---|---|
| `package.json` | `requirements.txt` or `pyproject.toml` |
| `package-lock.json` | `requirements.txt` (pinned) or `poetry.lock` |
| `node_modules/` | `.venv/` (virtual environment) |
| `npx playwright install` | `playwright install` |
| `npm init playwright@latest` | `pip install pytest-playwright` (manual scaffold) |

---

## 3. Project Structure

Your JS project (this repo) looks like:

```
PlaywrightCICD/
├── playwright.config.js
├── package.json
├── tests/
│   ├── login/
│   │   └── fixture-demo.spec.js
│   └── example.spec.js
```

A typical Python Playwright + pytest project looks like:

```
playwright-python-project/
├── requirements.txt
├── pytest.ini                # or pyproject.toml [tool.pytest.ini_options]
├── conftest.py                # shared fixtures — like a global test.extend in JS
├── tests/
│   ├── login/
│   │   ├── test_login.py
│   │   └── conftest.py        # fixtures scoped to this folder
│   └── test_example.py
├── pages/                     # Page Object Model classes
│   ├── login_page.py
│   └── dashboard_page.py
└── .github/workflows/
    └── playwright.yml
```

Key naming differences (pytest conventions, not optional style):

- Test **files** must be named `test_*.py` or `*_test.py` (not `*.spec.py`).
- Test **functions** must start with `test_` (e.g. `def test_login_succeeds():`), just like `test('...')` in JS.
- Test **classes**, if used, must start with `Test` and contain no `__init__`.

---

## 4. Sync vs Async API

**JS (always async):**

```javascript
const { test, expect } = require('@playwright/test');

test('title check', async ({ page }) => {
  await page.goto('https://example.com');
  await expect(page).toHaveTitle(/Example/);
});
```

**Python — raw sync API (no pytest, just to see the shape):**

```python
from playwright.sync_api import sync_playwright, expect

with sync_playwright() as p:
    browser = p.chromium.launch(headless=False)
    page = browser.new_page()
    page.goto("https://example.com")
    expect(page).to_have_title("Example Domain")
    browser.close()
```

Notice: **no `await` anywhere.** The sync API blocks under the hood so your test code reads like ordinary procedural Python. This is the biggest mental shift coming from JS — you do NOT need `async def` / `await` for standard Playwright test code.

**Python — raw async API (only if you need it):**

```python
import asyncio
from playwright.async_api import async_playwright, expect

async def main():
    async with async_playwright() as p:
        browser = await p.chromium.launch(headless=False)
        page = await browser.new_page()
        await page.goto("https://example.com")
        await expect(page).to_have_title("Example Domain")
        await browser.close()

asyncio.run(main())
```

This looks exactly like the JS you already know — `await` everywhere. If you ever see `async def test_...` in a Python Playwright test, that project has opted into `pytest-asyncio` + the async API. It's rarer; default to sync.

---

## 5. Core Concept Mapping: JS → Python

| Concept | Playwright JS/TS | Playwright Python |
|---|---|---|
| Test runner | `@playwright/test` (built-in) | `pytest` + `pytest-playwright` plugin |
| Define a test | `test('name', async ({ page }) => {...})` | `def test_name(page):` |
| Group tests | `test.describe('group', () => {...})` | A `class TestGroup:` or just a Python module/file |
| Setup/teardown | `test.beforeEach`, `test.afterEach` | pytest fixtures (`yield`-based), or `setup_method`/`teardown_method` |
| Skip a test | `test.skip()` | `@pytest.mark.skip` |
| Conditional skip | `test.skip(condition, reason)` | `@pytest.mark.skipif(condition, reason="...")` |
| Only run this test | `test.only(...)` | `pytest -k test_name` (no direct decorator) |
| Fixtures/DI | `test.extend({...})`, built-in `page`, `browser`, `context` | pytest fixtures in `conftest.py`; `page`, `browser`, `context` auto-provided by `pytest-playwright` |
| Config file | `playwright.config.js` | `pytest.ini` / `pyproject.toml` + CLI flags |
| Assertions | `expect(locator).toBeVisible()` | `expect(locator).to_be_visible()` |
| Parameterized tests | loop + `test()` calls, or `test.describe.parametrize` (community) | `@pytest.mark.parametrize` (native, first-class) |
| Environment variables | `process.env.X` | `os.environ["X"]` or `os.getenv("X")` |
| Async | native `async/await` | usually none needed (sync API) |

---

## 6. Locators & Actions

**The locator API itself is nearly identical** — same philosophy, same auto-waiting, same chaining. Only the casing changes: JS camelCase → Python snake_case.

| JS | Python |
|---|---|
| `page.getByRole('button', { name: 'Submit' })` | `page.get_by_role("button", name="Submit")` |
| `page.getByText('Welcome')` | `page.get_by_text("Welcome")` |
| `page.getByLabel('Email')` | `page.get_by_label("Email")` |
| `page.getByPlaceholder('Search')` | `page.get_by_placeholder("Search")` |
| `page.getByTestId('submit-btn')` | `page.get_by_test_id("submit-btn")` |
| `page.locator('.class')` | `page.locator(".class")` |
| `locator.click()` | `locator.click()` |
| `locator.fill('text')` | `locator.fill("text")` |
| `locator.check()` | `locator.check()` |
| `locator.selectOption('value')` | `locator.select_option("value")` |
| `locator.isVisible()` | `locator.is_visible()` |
| `locator.waitFor()` | `locator.wait_for()` |
| `locator.first` | `locator.first` |
| `locator.nth(2)` | `locator.nth(2)` |
| `page.waitForURL('...')` | `page.wait_for_url("...")` |
| `page.waitForLoadState('networkidle')` | `page.wait_for_load_state("networkidle")` |

### Side-by-side example

**JS:**

```javascript
test('login', async ({ page }) => {
  await page.goto('/login');
  await page.getByLabel('Username').fill('admin');
  await page.getByLabel('Password').fill('secret123');
  await page.getByRole('button', { name: 'Log in' }).click();
  await expect(page.getByText('Welcome, admin')).toBeVisible();
});
```

**Python:**

```python
def test_login(page):
    page.goto("/login")
    page.get_by_label("Username").fill("admin")
    page.get_by_label("Password").fill("secret123")
    page.get_by_role("button", name="Log in").click()
    expect(page.get_by_text("Welcome, admin")).to_be_visible()
```

That's it — same structure, same locator strategy, just Python syntax and no `await`.

---

## 7. Assertions (`expect`)

Same web-first, auto-retrying `expect()` you know from JS, imported from `playwright.sync_api` instead of `@playwright/test`.

| JS | Python |
|---|---|
| `await expect(locator).toBeVisible()` | `expect(locator).to_be_visible()` |
| `await expect(locator).toHaveText('foo')` | `expect(locator).to_have_text("foo")` |
| `await expect(locator).toHaveValue('foo')` | `expect(locator).to_have_value("foo")` |
| `await expect(locator).toHaveCount(3)` | `expect(locator).to_have_count(3)` |
| `await expect(locator).toBeEnabled()` | `expect(locator).to_be_enabled()` |
| `await expect(page).toHaveURL(/dashboard/)` | `expect(page).to_have_url(re.compile("dashboard"))` |
| `await expect(page).toHaveTitle('Home')` | `expect(page).to_have_title("Home")` |
| `expect(value).toBe(5)` (generic assert) | `assert value == 5` (plain Python `assert`, pytest rewrites it for rich diffs) |

Note: for **non-Playwright** assertions (comparing plain values, not locators/pages), you don't need a special import — pytest's plain `assert` statement gives rich failure output automatically, unlike Node's built-in `assert`.

```python
def test_item_count(page):
    items = page.locator(".item")
    expect(items).to_have_count(5)   # Playwright web-first assertion (auto-retries)

    count = items.count()
    assert count == 5                # plain Python assertion (no retry, immediate check)
```

---

## 8. Writing Tests with Pytest

Pytest is conceptually similar to the built-in `@playwright/test` runner, but it's a general-purpose Python test framework that Playwright plugs into — closer in spirit to combining Jest + Playwright's test runner into one, if that helps the mental model.

### Basic test

```python
# tests/test_example.py
from playwright.sync_api import Page, expect

def test_homepage_has_title(page: Page):
    page.goto("https://playwright.dev")
    expect(page).to_have_title("Fast and reliable end-to-end testing for modern web apps | Playwright")
```

Run it:

```bash
pytest tests/test_example.py
```

### Grouping tests (like `test.describe`)

**JS:**

```javascript
test.describe('Login flow', () => {
  test('valid credentials', async ({ page }) => { /* ... */ });
  test('invalid credentials', async ({ page }) => { /* ... */ });
});
```

**Python:**

```python
class TestLoginFlow:
    def test_valid_credentials(self, page):
        ...

    def test_invalid_credentials(self, page):
        ...
```

### Parametrized tests (native, and arguably nicer than JS)

```python
import pytest

@pytest.mark.parametrize("username,password,expected", [
    ("admin", "secret123", "Welcome, admin"),
    ("guest", "wrongpass", "Invalid credentials"),
])
def test_login_variants(page, username, password, expected):
    page.goto("/login")
    page.get_by_label("Username").fill(username)
    page.get_by_label("Password").fill(password)
    page.get_by_role("button", name="Log in").click()
    expect(page.get_by_text(expected)).to_be_visible()
```

### Markers (tags)

JS uses `@tag` strings in test titles or annotations; pytest uses **markers**.

```python
import pytest

@pytest.mark.smoke
def test_critical_login_path(page):
    ...
```

Register custom markers in `pytest.ini`:

```ini
[pytest]
markers =
    smoke: quick critical-path checks
    regression: full regression suite
```

Run only smoke tests:

```bash
pytest -m smoke
```

---

## 9. Fixtures: JS Fixtures vs Pytest Fixtures

This is the concept most worth spending time on, because the *keyword* "fixture" means something different in each ecosystem.

- **Playwright JS fixtures** (`test.extend`) are about **dependency injection for tests** — declaring `page`, `context`, `browser`, or your own custom objects that get auto-created and torn down per test.
- **Pytest fixtures** are the **same idea**, but it's a pytest-native mechanism, not Playwright-specific. `pytest-playwright` simply *registers* `page`, `context`, `browser`, `browser_name` etc. as pytest fixtures for you.

So conceptually: `test.extend({...})` in JS ≈ writing your own fixtures in `conftest.py` in Python.

### Built-in fixtures (auto-available, no import needed)

| Fixture | Scope | Equivalent in JS |
|---|---|---|
| `page` | function | `page` |
| `context` | function | `context` |
| `browser` | session | `browser` |
| `browser_name` | session | `browserName` |
| `browser_type_launch_args` | override | `use: { launchOptions }` |

### Your `fixture-demo.spec.js` in Python terms

Since you have `tests/login/fixture-demo.spec.js` open, here's the mental translation. Suppose the JS fixture looks like this:

```javascript
// JS
const test = base.extend({
  loggedInPage: async ({ page }, use) => {
    await page.goto('/login');
    await page.getByLabel('Username').fill('admin');
    await page.getByLabel('Password').fill('secret123');
    await page.getByRole('button', { name: 'Log in' }).click();
    await use(page);
  },
});

test('dashboard shows welcome message', async ({ loggedInPage }) => {
  await expect(loggedInPage.getByText('Welcome')).toBeVisible();
});
```

**Python equivalent (`conftest.py`):**

```python
# tests/login/conftest.py
import pytest

@pytest.fixture
def logged_in_page(page):
    page.goto("/login")
    page.get_by_label("Username").fill("admin")
    page.get_by_label("Password").fill("secret123")
    page.get_by_role("button", name="Log in").click()
    yield page   # <-- everything after `yield` runs as teardown (like code after `use()` in JS)
```

```python
# tests/login/test_dashboard.py
from playwright.sync_api import expect

def test_dashboard_shows_welcome_message(logged_in_page):
    expect(logged_in_page.get_by_text("Welcome")).to_be_visible()
```

Key mapping:

| JS fixture concept | Python (pytest) equivalent |
|---|---|
| `test.extend({ name: async ({...}, use) => {...} })` | `@pytest.fixture` decorated function |
| `await use(value)` — hand control back to the test | `yield value` — hand control back to the test |
| Code after `use()` = teardown | Code after `yield` = teardown |
| Fixture depends on `page` | Fixture takes `page` as a parameter |
| File `fixtures.ts`, imported/re-exported | File `conftest.py`, auto-discovered by pytest (no import needed) |
| Fixture scope: per-test by default | `@pytest.fixture` default scope is `function`; use `@pytest.fixture(scope="session")` etc. for broader scope |

**Fixture scopes** (Python has more granularity than JS out of the box):

```python
@pytest.fixture(scope="session")   # once per whole test run
@pytest.fixture(scope="module")    # once per test file
@pytest.fixture(scope="class")     # once per test class
@pytest.fixture(scope="function")  # default: once per test
```

**Auto-use fixtures** (run for every test without being requested — like a global `beforeEach`):

```python
@pytest.fixture(autouse=True)
def go_to_base_url(page):
    page.goto("https://example.com")
```

---

## 10. Page Object Model in Python

You already use POM in JS as classes. Python POM looks nearly identical, just Pythonic.

**JS:**

```javascript
class LoginPage {
  constructor(page) {
    this.page = page;
    this.username = page.getByLabel('Username');
    this.password = page.getByLabel('Password');
    this.submit = page.getByRole('button', { name: 'Log in' });
  }

  async login(user, pass) {
    await this.username.fill(user);
    await this.password.fill(pass);
    await this.submit.click();
  }
}
module.exports = { LoginPage };
```

**Python:**

```python
# pages/login_page.py
from playwright.sync_api import Page

class LoginPage:
    def __init__(self, page: Page):
        self.page = page
        self.username = page.get_by_label("Username")
        self.password = page.get_by_label("Password")
        self.submit = page.get_by_role("button", name="Log in")

    def login(self, user: str, password: str):
        self.username.fill(user)
        self.password.fill(password)
        self.submit.click()
```

**Usage in a test:**

```python
from pages.login_page import LoginPage

def test_login(page):
    login_page = LoginPage(page)
    page.goto("/login")
    login_page.login("admin", "secret123")
    expect(page.get_by_text("Welcome")).to_be_visible()
```

Even nicer: expose the page object itself as a fixture so tests don't instantiate it manually:

```python
# conftest.py
import pytest
from pages.login_page import LoginPage

@pytest.fixture
def login_page(page):
    return LoginPage(page)
```

```python
def test_login(page, login_page):
    page.goto("/login")
    login_page.login("admin", "secret123")
    expect(page.get_by_text("Welcome")).to_be_visible()
```

---

## 11. Configuration (`pytest.ini` / `conftest.py` vs `playwright.config.js`)

There's no single config file that mirrors `playwright.config.js` exactly — settings are split between `pytest.ini` (or `pyproject.toml`) and CLI flags. Here's the mapping:

| `playwright.config.js` option | Python equivalent |
|---|---|
| `testDir: './tests'` | pytest auto-discovers `tests/` or is pointed at it: `pytest tests/` |
| `timeout: 30000` | `--timeout=30` (needs `pytest-timeout`) or per-test `page.set_default_timeout()` |
| `retries: 2` | `pytest --reruns 2` (needs `pytest-rerunfailures`) |
| `workers: 4` | `pytest -n 4` (needs `pytest-xdist`) |
| `use: { baseURL: '...' }` | `pytest --base-url=https://example.com` (built into `pytest-playwright`) |
| `use: { headless: false }` | `pytest --headed` |
| `use: { browserName: 'firefox' }` | `pytest --browser firefox` |
| `use: { screenshot: 'only-on-failure' }` | `pytest --screenshot only-on-failure` |
| `use: { video: 'retain-on-failure' }` | `pytest --video retain-on-failure` |
| `use: { trace: 'on-first-retry' }` | `pytest --tracing retain-on-failure` |
| `projects: [{ name: 'chromium' }, ...]` | run multiple times with `--browser`, or parametrize `browser_name` fixture |
| `reporter: 'html'` | `pytest --html=report.html` (needs `pytest-html`), or Allure/JUnit plugins |

**Example `pytest.ini`:**

```ini
[pytest]
testpaths = tests
addopts = --browser chromium --headed=false --screenshot only-on-failure --video retain-on-failure
markers =
    smoke: critical path tests
    regression: full regression suite
```

**`conftest.py` for cross-cutting setup (base URL, custom browser context args)** — this is roughly your `use:` block in JS config:

```python
# conftest.py
import pytest

@pytest.fixture(scope="session")
def browser_context_args(browser_context_args):
    return {
        **browser_context_args,
        "viewport": {"width": 1280, "height": 720},
        "ignore_https_errors": True,
    }
```

---

## 12. Running Tests: CLI Cheat Sheet

| Task | JS (`npx playwright test`) | Python (`pytest`) |
|---|---|---|
| Run all tests | `npx playwright test` | `pytest` |
| Run one file | `npx playwright test tests/login.spec.js` | `pytest tests/test_login.py` |
| Run by test name | `npx playwright test -g "login"` | `pytest -k "login"` |
| Run headed | `npx playwright test --headed` | `pytest --headed` |
| Choose browser | `npx playwright test --project=firefox` | `pytest --browser firefox` |
| Run in debug mode | `npx playwright test --debug` | `PWDEBUG=1 pytest -s` |
| Open codegen | `npx playwright codegen` | `playwright codegen` (same, it's a standalone CLI tool) |
| Show last HTML report | `npx playwright show-report` | depends on reporter plugin used (e.g. `pytest --html=report.html`, then open the file) |
| Update snapshots | `npx playwright test --update-snapshots` | `pytest --update-snapshots` (visual comparisons need `pytest-playwright`'s snapshot support) |
| Verbose output | `npx playwright test --reporter=list` | `pytest -v` |
| Stop on first failure | `npx playwright test -x` | `pytest -x` |

---

## 13. Parallelism, Retries, Tags

**Parallelism** — JS has built-in workers; Python needs the `pytest-xdist` plugin:

```bash
pip install pytest-xdist
pytest -n 4          # 4 parallel workers, like `workers: 4` in playwright.config.js
pytest -n auto        # auto-detect CPU count
```

**Retries** — JS has built-in `retries`; Python needs `pytest-rerunfailures`:

```bash
pip install pytest-rerunfailures
pytest --reruns 2 --reruns-delay 1
```

**Tags/markers** — covered in [Section 8](#8-writing-tests-with-pytest). Use `-m` to filter:

```bash
pytest -m "smoke and not slow"
```

---

## 14. Tracing, Screenshots, Video, Reports

Same underlying Playwright trace viewer, screenshot, and video capture — just enabled via pytest flags instead of config keys.

```bash
pytest --tracing retain-on-failure --screenshot only-on-failure --video retain-on-failure
```

Artifacts land in `test-results/` — same directory convention as JS.

**View a trace** (identical to JS — it's the same standalone tool):

```bash
playwright show-trace test-results/trace.zip
```

**HTML report** (needs a plugin, unlike JS's built-in HTML reporter):

```bash
pip install pytest-html
pytest --html=report.html --self-contained-html
```

Many teams instead use **Allure** for richer reports:

```bash
pip install allure-pytest
pytest --alluredir=allure-results
allure serve allure-results
```

---

## 15. API Testing

Same `request` context concept as JS, just snake_case.

**JS:**

```javascript
test('get user', async ({ request }) => {
  const response = await request.get('/api/users/1');
  expect(response.ok()).toBeTruthy();
  const body = await response.json();
  expect(body.name).toBe('Alice');
});
```

**Python:**

```python
def test_get_user(page, request):
    response = request.get("/api/users/1")
    assert response.ok
    body = response.json()
    assert body["name"] == "Alice"
```

`request` is another auto-provided pytest fixture from `pytest-playwright` — no setup needed, same as in JS.

---

## 16. CI Integration (GitHub Actions)

Your JS workflow (`.github/workflows/`) probably looks like:

```yaml
- run: npm ci
- run: npx playwright install --with-deps
- run: npx playwright test
```

The Python equivalent:

```yaml
name: Playwright Tests (Python)
on:
  push:
    branches: [main]
  pull_request:
    branches: [main]

jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4

      - uses: actions/setup-python@v5
        with:
          python-version: "3.11"

      - name: Install dependencies
        run: |
          python -m pip install --upgrade pip
          pip install -r requirements.txt

      - name: Install Playwright browsers
        run: playwright install --with-deps

      - name: Run tests
        run: pytest --browser chromium --tracing retain-on-failure

      - uses: actions/upload-artifact@v4
        if: always()
        with:
          name: test-results
          path: test-results/
```

---

## 17. Common Gotchas for JS Devs

1. **No `await` needed (sync API).** Forgetting this and writing `await page.goto(...)` in the sync API is a syntax error — Python doesn't allow `await` outside `async def`.
2. **snake_case everywhere.** `getByRole` → `get_by_role`, `toHaveText` → `to_have_text`, `waitForSelector` → `wait_for_selector`. Autocomplete in your IDE will save you here once `pytest-playwright` type stubs are installed.
3. **`expect` import differs by API flavor.** `from playwright.sync_api import expect` for sync tests. Mixing sync and async imports in the same file causes confusing runtime errors.
4. **Fixtures are named parameters, not destructured objects.** JS: `async ({ page, request }) => {}`. Python: `def test_x(page, request):` — pytest matches parameter *names* to fixture names, so don't rename them casually.
5. **`conftest.py` is auto-discovered — no imports.** Unlike JS where you `import { test } from './fixtures'`, pytest automatically finds `conftest.py` files up the directory tree. This is powerful but "magic" until you're used to it — a fixture used in `tests/login/test_x.py` might be defined in `tests/login/conftest.py`, `tests/conftest.py`, or the root `conftest.py`.
6. **`test.step()` equivalent.** JS has `test.step('name', async () => {...})` for readable reports. Python: use `with page.context.tracing` steps, or simply well-named helper functions / pytest's `-v` output with docstrings. There's no exact 1:1 built-in, but you can approximate with:
   ```python
   from playwright.sync_api import expect
   import allure  # if using allure-pytest

   @allure.step("Log in as admin")
   def login_as_admin(page):
       ...
   ```
7. **Type hints are optional but recommended.** `def test_login(page: Page):` gives you IDE autocomplete similar to TS's type inference. Without the hint, `page` still works (pytest injects it at runtime) but you lose autocomplete.
8. **Virtual environments are not optional in practice.** Always work inside `.venv`; otherwise you'll pollute your global Python install the way you'd never dream of skipping `node_modules`.
9. **`assert` vs `expect`.** Use `expect()` for anything involving the page/locators (auto-waiting, retries). Use plain `assert` only for comparing already-known Python values (e.g., API response bodies, computed numbers) where no waiting is needed.
10. **No built-in test isolation guarantee like JS's per-test browser context — but it IS there.** `pytest-playwright` gives you a fresh `context`/`page` per test function by default, same isolation guarantee as `@playwright/test`. You don't need to build this yourself.

---

## 18. Quick Reference Cheat Sheet

```python
# ── Imports ──────────────────────────────────────────────
from playwright.sync_api import Page, expect
import pytest

# ── Basic test ───────────────────────────────────────────
def test_example(page: Page):
    page.goto("https://example.com")
    expect(page).to_have_title("Example Domain")

# ── Locators ─────────────────────────────────────────────
page.get_by_role("button", name="Submit")
page.get_by_text("Welcome")
page.get_by_label("Email")
page.get_by_placeholder("Search")
page.get_by_test_id("id")
page.locator(".css-selector")

# ── Actions ──────────────────────────────────────────────
locator.click()
locator.fill("text")
locator.check()
locator.select_option("value")
locator.hover()
locator.press("Enter")

# ── Assertions ───────────────────────────────────────────
expect(locator).to_be_visible()
expect(locator).to_have_text("foo")
expect(locator).to_have_value("foo")
expect(locator).to_have_count(3)
expect(page).to_have_url("https://example.com/dashboard")

# ── Fixtures ─────────────────────────────────────────────
@pytest.fixture
def my_fixture(page):
    page.goto("/setup")
    yield page
    # teardown code here

@pytest.fixture(autouse=True, scope="session")
def global_setup():
    print("runs once before all tests")
    yield

# ── Parametrize ──────────────────────────────────────────
@pytest.mark.parametrize("a,b", [(1, 2), (3, 4)])
def test_pairs(a, b):
    assert a < b

# ── Markers / tags ───────────────────────────────────────
@pytest.mark.smoke
def test_tagged():
    ...

# ── CLI ──────────────────────────────────────────────────
# pytest                              # run everything
# pytest -k "login"                   # filter by name
# pytest -m smoke                     # filter by marker
# pytest --headed --browser firefox   # visible firefox
# pytest -n 4                         # parallel (needs pytest-xdist)
# pytest --tracing retain-on-failure  # capture trace
```

---

## 19. Practice Exercises

To build real muscle memory, port these from your existing JS suite:

1. Take `tests/login/fixture-demo.spec.js` and rewrite it as `tests/login/test_login.py`, converting the custom fixture to a `conftest.py` pytest fixture (see [Section 9](#9-fixtures-js-fixtures-vs-pytest-fixtures)).
2. Take `tests/example.spec.js` and port it to `tests/test_example.py`.
3. Build a `LoginPage` class in `pages/login_page.py` and refactor your login test to use it, mirroring any POM classes you already have in JS.
4. Add a `pytest.ini` with `smoke` and `regression` markers, and tag your ported tests.
5. Set up a GitHub Actions workflow (`.github/workflows/playwright-python.yml`) that installs Python deps, installs browsers, and runs `pytest -m smoke` on every PR — parallel to your existing JS CI workflow.
6. Once comfortable, try `pytest -n auto` to parallelize the suite and compare run time against the JS suite's `workers` config.

---

## 20. Further Reading

- Official docs: https://playwright.dev/python/docs/intro
- Pytest plugin reference: https://playwright.dev/python/docs/test-runners
- API reference (sync): https://playwright.dev/python/docs/api/class-playwright
- Pytest documentation (fixtures deep dive): https://docs.pytest.org/en/stable/how-to/fixtures.html
- `pytest-xdist` (parallel execution): https://pytest-xdist.readthedocs.io/
- `pytest-rerunfailures` (retries): https://github.com/pytest-dev/pytest-rerunfailures
- `allure-pytest` (rich reporting): https://allurereport.org/docs/pytest/

---

*Guide generated for internal QA onboarding — transitioning from Playwright/JS to Playwright/Python.*
