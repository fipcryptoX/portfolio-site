# Notion Schema for This Portfolio Template

This schema is reverse-engineered from the codebase and matches the current
`pages/*.js` Notion queries and property reads.

Use `scripts/notion/setup-template-databases.js` to create these databases
automatically in Notion.

## Required Environment Variables

- `NOTION_API_KEY`
- `NOTION_RECENTS_ID`
- `NOTION_GOODS_ID`
- `NOTION_READINGLIST_ID`
- `NOTION_EXPERIENCE_ID`
- `NOTION_INVESTMENTS_ID`
- `NOTION_NEWSLETTERS_ID`
- `NOTION_PODCASTS_ID`
- `NOTION_TALENT_ID`

## Database Schemas

### 1) Recents (`NOTION_RECENTS_ID`)

- `Name` (title)
- `Display` (checkbox)
- `Time` (date)
- `Body` (rich_text)
- `URL` (url)
- `Path` (url)
- `Logo` (files)
- `Tags` (multi_select)

Used by:
- `pages/index.js`
- `pages/about.js`
- `pages/writing/index.js` (currently fetched but not rendered)

### 2) Goods (`NOTION_GOODS_ID`)

- `Name` (title)
- `Display` (checkbox)
- `Created` (date)
- `URL` (url)
- `Note` (rich_text)
- `Fav` (checkbox)
- `Tags` (multi_select)
- `Thumbnail` (files)
- `Price` (number)
- `Brand` (rich_text)

Used by:
- `pages/index.js`
- `pages/goods.js`

### 3) Reading List (`NOTION_READINGLIST_ID`)

- `Name` (title)
- `Display` (checkbox)
- `Created` (date)
- `URL` (url)
- `Fav` (checkbox)
- `Tags` (multi_select)

Used by:
- `pages/index.js`
- `pages/reading-list.js`

### 4) Experience (`NOTION_EXPERIENCE_ID`)

- `Name` (title)
- `Display` (checkbox)
- `Order` (number)
- `Date` (rich_text)
- `URL` (url)
- `Body` (rich_text)

Used by:
- `pages/about.js`
- `pages/writing/index.js` (currently fetched but not rendered)

### 5) Investments (`NOTION_INVESTMENTS_ID`)

- `Name` (title)
- `Display` (checkbox)
- `Order` (number)
- `Private` (checkbox)
- `Path` (url)
- `Body` (rich_text)
- `URL` (url)
- `Logo` (files)

Used by:
- `pages/investments.js`

### 6) Newsletters (`NOTION_NEWSLETTERS_ID`)

- `Name` (title)
- `Display` (checkbox)
- `Order` (number)
- `Path` (url)
- `Logo` (files)
- `Body` (rich_text)
- `URL` (url)
- `Tags` (multi_select)
- `Fav` (checkbox)

Used by:
- `pages/newsletters.js`

### 7) Podcasts (`NOTION_PODCASTS_ID`)

- `Name` (title)
- `Order` (number)
- `Path` (url)
- `Logo` (files)
- `Body` (rich_text)
- `URL` (url)
- `Tags` (multi_select)
- `Fav` (checkbox)

Used by:
- `pages/podcasts.js`

### 8) Talent (`NOTION_TALENT_ID`)

- `Name` (title)
- `Display` (checkbox)
- `Created` (date)
- `URL` (url)
- `Fav` (checkbox)
- `Tags` (multi_select)
- `NotableUrl` (url)
- `NotableTitle` (rich_text)

Used by:
- `pages/talent.js`

## Setup Script

Command:

```bash
export NOTION_API_KEY=...
node scripts/notion/setup-template-databases.js --parent-page-id <NOTION_PAGE_ID>
```

The script is idempotent by title:
- Reuses existing child databases with matching titles
- Creates missing ones
- Prints all env variable IDs for `.env.local`
