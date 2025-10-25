# Commit Message Convention

Dự án này tuân theo [Conventional Commits](https://www.conventionalcommits.org/).

## Format

```
<type>(<scope>): <subject>

<body>

<footer>
```

## Types

- **feat**: Tính năng mới
- **fix**: Sửa bug
- **docs**: Thay đổi documentation
- **style**: Formatting, missing semi colons, etc; no code change
- **refactor**: Refactoring production code
- **test**: Thêm tests, refactoring test; no production code change
- **chore**: Cập nhật build tasks, package manager configs, etc; no production code change
- **perf**: Cải thiện performance
- **ci**: Thay đổi CI/CD
- **build**: Thay đổi build system hoặc dependencies

## Scope (optional)

- **auth**: Authentication
- **cart**: Shopping cart
- **product**: Product management
- **order**: Order management
- **payment**: Payment integration
- **ui**: UI components
- **api**: API integration

## Examples

```bash
# Tính năng mới
git commit -m "feat(auth): add login functionality"
git commit -m "feat(product): implement product search"

# Sửa bug
git commit -m "fix(cart): resolve item duplication issue"
git commit -m "fix(payment): handle failed transaction"

# Documentation
git commit -m "docs: update README with setup instructions"
git commit -m "docs(api): add API documentation"

# Refactor
git commit -m "refactor(ui): simplify button component"
git commit -m "refactor: optimize image loading"

# Style
git commit -m "style: format code with prettier"
git commit -m "style(product): adjust card layout"

# Chore
git commit -m "chore: update dependencies"
git commit -m "chore: configure husky hooks"

# Performance
git commit -m "perf(product): optimize product listing query"
git commit -m "perf: lazy load product images"
```

## Breaking Changes

Nếu có breaking changes, thêm `BREAKING CHANGE:` vào footer:

```bash
git commit -m "feat(api)!: change product API endpoint

BREAKING CHANGE: Product API endpoint changed from /api/products to /api/v2/products"
```

## Rules

1. Subject line không quá 50 ký tự
2. Sử dụng imperative mood ("add" not "added")
3. Không viết hoa chữ cái đầu của subject
4. Không dùng dấu chấm ở cuối subject
5. Body giải thích "what" và "why", không phải "how"

---

**Note**: Pre-commit hooks sẽ tự động format code trước khi commit! 🚀
