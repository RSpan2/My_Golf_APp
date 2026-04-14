# My Golf App — Task List

Hierarchy: **Epic → Story → Task → Step** (smallest unit)

---

## Status Key

- [ ] Not started
- [~] In progress
- [x] Complete

---

# EPIC 1: Scorecard & Round Tracking

---

## Story 1.1: User can create a golf course ✅

### Task 1.1.1: Define course data types (`constants/course.ts`)
> *As a developer, I want a shared Course and Hole type definition so that every part of the app works with a consistent, type-safe data structure.*
- [x] Create `constants/course.ts` file
- [x] Define `Tee` union type: `'blue' | 'white' | 'red' | 'gold'`
- [x] Define `TeeRatings` interface: `{ courseRating: number; slope: number }`
- [x] Define `HoleYardages` interface: `{ blue?: number; white?: number; red?: number; gold?: number }`
- [x] Define `Hole` interface with fields: `number`, `par`, `yardages`, `handicapIndex`
- [x] Define `Course` interface with fields: `id`, `name`, `city`, `state`, `holes`, `isHome`, `ratings` (per tee)
- [x] Export all types

### Task 1.1.2: Create course storage service (`services/courseStorage.ts`)
> *As a golfer, I want my courses saved to my device so that I don't have to re-enter them every time I open the app.*
- [x] Create `services/courseStorage.ts` file
- [x] Define `COURSES_KEY` AsyncStorage constant
- [x] Write `loadCourses(): Promise<Course[]>` — parse JSON or return `[]`
- [x] Write `saveCourses(courses: Course[]): Promise<void>` — stringify and store
- [x] Write `getCourseById(id: string): Promise<Course | undefined>`
- [x] Write `upsertCourse(course: Course): Promise<void>` — add or replace by id
- [x] Write `deleteCourse(id: string): Promise<void>` — filter and re-save
- [x] Export all functions

### Task 1.1.3: Build Add Course screen (`app/course/new.tsx`)
> *As a golfer, I want to add a new course by entering its name, city, and state so that I can track rounds played there.*
- [x] Create `app/course/new.tsx` file
- [x] Add `SafeAreaView` container with dark background
- [x] Add header with back button and "New Course" title
- [x] Add `TextInput` for course name
- [x] Add `TextInput` for city
- [x] Add `TextInput` for state (2-char, auto-caps)
- [x] Add number of holes selector (9 or 18, default 18)
- [x] On save: generate id (`Date.now().toString()`)
- [x] On save: build default holes array (all par 4, yardages empty, handicapIndex 1–count)
- [x] On save: call `upsertCourse` and navigate back
- [x] Disable save button if course name is empty
- [x] Style all elements with `StyleSheet` matching design system

### Task 1.1.4: Build My Courses screen (`app/(tabs)/courses.tsx`)
> *As a golfer, I want to see all my saved courses in one place so that I can quickly pick one when starting a round.*
- [x] Create `app/(tabs)/courses.tsx` file
- [x] Add `SafeAreaView` container
- [x] Add header with "Courses" title and "+" add button
- [x] Load courses on focus with `useFocusEffect`
- [x] Render empty state if no courses saved
- [x] Render each course as a card (name, city/state, hole count)
- [x] Tap card → navigate to `app/course/[id].tsx`
- [x] Tap "+" → navigate to `app/course/new.tsx`
- [x] Style with `StyleSheet` matching design system

### Task 1.1.5: Register Courses tab in navigation (`app/(tabs)/_layout.tsx`)
> *As a golfer, I want a Courses tab in the main navigation so that I can access my courses without hunting through menus.*
- [x] Open `app/(tabs)/_layout.tsx`
- [x] Add a third `Tabs.Screen` entry for `courses`
- [x] Set tab icon (`map-outline` from Ionicons)
- [x] Set tab label "Courses"

### Bonus: Delete course from detail screen
- [x] Trash icon in header of `app/course/[id].tsx`
- [x] Confirmation modal before deleting
- [x] Navigates back to courses list on confirm

---

## Story 1.2: User can view and edit hole details ✅

### Task 1.2.1: Build Course Detail screen (`app/course/[id].tsx`)
> *As a golfer, I want to see all 18 holes for a course at a glance so that I know what data is entered and what still needs to be filled in.*
- [x] Create `app/course/[id].tsx` file
- [x] Load course by `id` param on mount
- [x] Add header: back button, course name, edit + delete buttons
- [x] Show summary strip: hole count, total par, total white yardage
- [x] Render list of holes, each showing hole number, par, white yardage, handicap index
- [x] Tap a hole row → open Hole Editor modal
- [x] Style with `StyleSheet` matching design system

### Task 1.2.2: Build Hole Editor modal (`components/course/HoleEditor.tsx`)
> *As a golfer, I want to set the par, yardage, and handicap index for each hole so that my scorecard and club recommendations are accurate.*
- [x] Create `components/course/` directory
- [x] Create `components/course/HoleEditor.tsx`
- [x] Accept props: `hole`, `onSave(updatedHole)`, `onClose`, `visible`
- [x] Show hole number in header
- [x] Add Par selector: 3-button toggle (3 / 4 / 5), highlight active
- [x] Add yardage inputs for each tee: Blue, White, Red, Gold (number pad)
- [x] Add Handicap Index input: number 1–18 (clamped on save)
- [x] "Save Hole" button calls `onSave` and closes
- [x] "Cancel" button discards changes and closes
- [x] Style with `StyleSheet` matching design system

### Task 1.2.3: Wire Hole Editor save back to storage
> *As a golfer, I want my hole edits to persist immediately so that I never lose data I've already entered.*
- [x] In `app/course/[id].tsx`, maintain local `course` state
- [x] On `HoleEditor` save: replace hole in `course.holes` array by hole number
- [x] Call `upsertCourse` with updated course
- [x] Re-render course detail list to reflect changes

### Task 1.2.4: Build Course Edit screen (name/city/state)
> *As a golfer, I want to edit a course's name, location, and tee ratings so that I can fix mistakes and keep course data up to date.*
- [x] Create `app/course/edit/[id].tsx` with form fields for course name, city, state
- [x] Save updates to storage on submit
- [ ] Rating inputs per tee (Course Rating + Slope) — deferred to Epic 2

---

## Story 1.3: User can start a new round ✅

### Task 1.3.1: Define Round and HoleScore types (`constants/round.ts`)
> *As a developer, I want a shared Round and HoleScore type so that scoring, storage, and history all work with the same data shape.*
- [x] Create `constants/round.ts` file
- [x] Define `HoleScore` interface: `hole`, `par`, `yardage`, `score`, `putts?`, `fairwayHit?`, `adjustedScore?`
- [x] Define `Round` interface: `id`, `courseId`, `courseName`, `date`, `tee`, `holes`, `shotTrackingEnabled`, `isComplete`
- [x] Export all types

### Task 1.3.2: Add round persistence to storage service
> *As a golfer, I want my in-progress and completed rounds saved to my device so that data is never lost if I close the app.*
- [x] Create `services/roundStorage.ts` (separate from courseStorage for clean separation)
- [x] Add `loadRounds(): Promise<Round[]>`
- [x] Add `saveRound(round: Round): Promise<void>` — upsert by id
- [x] Add `getRoundById(id: string): Promise<Round | undefined>`
- [x] Add `deleteRound(id: string): Promise<void>`
- [x] Add `loadInProgressRound(): Promise<Round | null>` — separate AsyncStorage key
- [x] Add `saveInProgressRound(round: Round): Promise<void>`
- [x] Add `clearInProgressRound(): Promise<void>`

### Task 1.3.3: Build Start Round screen (`app/round/new.tsx`)
> *As a golfer, I want to pick a course and tee color before starting a round so that my scorecard shows the correct yardages and par for every hole.*
- [x] Create `app/round/new.tsx` file
- [x] Load saved courses on mount
- [x] Render course picker list (cards, tap to select, highlight selected)
- [x] Show empty state if no courses saved
- [x] Add tee color selector: Blue / White / Red / Gold (auto-hide tees with no yardages; show all if none set)
- [x] Date field defaulting to today (YYYY-MM-DD, editable for logging older rounds)
- [x] Shot tracking toggle hidden — deferred to Epic 3
- [x] "Start Round" button disabled until course + tee selected
- [x] On start: build `Round` object with `HoleScore[]` for each hole, save to in-progress store
- [x] Navigate to `app/round/[id].tsx`
- [x] Style with `StyleSheet` matching design system

### Task 1.3.4: Prompt to resume in-progress round
> *As a golfer, I want to be prompted to resume my round if I close the app mid-round so that I don't lose any scores I've already entered.*
- [x] Rewrite `app/(tabs)/index.tsx` as proper Home screen
- [x] Check `loadInProgressRound()` on tab focus with `useFocusEffect`
- [x] Show green resume banner with course name, date, and "In progress" label
- [x] "Resume" button → navigate to scorecard
- [x] Dismiss (×) button → `clearInProgressRound` and hide banner
- [x] Stats row placeholder (populated in Story 1.6)
- [x] "Start Round" CTA button → `/round/new`
- [x] Recent rounds placeholder (populated in Story 1.6)

---

## Story 1.4: User can enter scores hole by hole

### Task 1.4.1: Build Scorecard screen (`app/round/[id].tsx`)
> *As a golfer, I want to enter my score for each hole during a round so that I can track my total score as I play.*
- [ ] Create `app/round/[id].tsx` file
- [ ] Load round by id (from in-progress store or completed rounds)
- [ ] Add header: course name, tee color badge, score vs par (running total)
- [ ] Render scrollable hole list
- [ ] Each hole row shows: hole number, par, yardage, score input
- [ ] Score input: "−" button, score display, "+" button
- [ ] Minimum score: 1. No maximum enforced.
- [ ] Auto-save to in-progress store on every score change
- [ ] Add Front 9 subtotal row after hole 9
- [ ] Add Back 9 subtotal row after hole 18
- [ ] Add Total row at bottom
- [ ] Style with `StyleSheet` matching design system

### Task 1.4.2: Score color coding
> *As a golfer, I want each score color-coded by its result vs par so that I can instantly see how I'm doing without reading every number.*
- [ ] Write `getScoreColor(score: number, par: number): string` utility
- [ ] Eagle or better (≤ par − 2) → `#facc15` (gold)
- [ ] Birdie (par − 1) → `#4ade80` (green)
- [ ] Par → `#ffffff` (white)
- [ ] Bogey (par + 1) → `#fbbf24` (yellow)
- [ ] Double bogey+ (≥ par + 2) → `#f87171` (red)
- [ ] Apply color to score display in each hole row
- [ ] Apply color to score bubble background (subtle tint)

### Task 1.4.3: Putts and fairway tracking (optional fields)
> *As a golfer, I want to optionally log putts and fairways hit so that I can analyze weaknesses in my game after the round.*
- [ ] Add expandable row per hole for optional stats
- [ ] Putts input: "−" / number / "+" (0–6)
- [ ] Fairway Hit toggle: show only on par 4s and 5s (not par 3s)
- [ ] Fairway options: Hit / Miss Left / Miss Right
- [ ] Collapsed by default, tap hole row to expand
- [ ] Save putts and fairwayHit to `HoleScore`

### Task 1.4.4: Club recommendation per hole
> *As a golfer, I want the scorecard to suggest which club to use based on the hole yardage and my saved distances so that I can make faster, smarter club selections.*
- [ ] Load user's active clubs + distances on scorecard mount
- [ ] For each hole, find club whose `distance` stat is closest to hole yardage
- [ ] Show recommendation below yardage: "7 Iron · 165 yds"
- [ ] Only show if user has distances for ≥ 3 clubs
- [ ] Hide recommendation if hole yardage is 0 (not set)

### Task 1.4.5: Finish Round flow
> *As a golfer, I want to officially finish a round so that it gets saved to my history and I can review my summary.*
- [ ] Add "Finish Round" button (sticky at bottom of scorecard)
- [ ] Show confirmation modal: "Are you sure? This will save and close the round."
- [ ] On confirm: move round from in-progress store to completed rounds store
- [ ] Navigate to Round Summary screen
- [ ] Clear in-progress round from AsyncStorage

---

## Story 1.5: User can view a round summary

### Task 1.5.1: Build Round Summary screen (`app/round/summary/[id].tsx`)
> *As a golfer, I want to see a full breakdown of my round after finishing so that I can understand how I played and identify areas to improve.*
- [ ] Create `app/round/summary/` directory
- [ ] Create `app/round/summary/[id].tsx`
- [ ] Load round by id from completed rounds
- [ ] Show course name, date, tee color
- [ ] Show total score and score vs par (large, prominent)
- [ ] Show hole-by-hole table: hole, par, score (color coded), putts
- [ ] Show Front 9, Back 9, and Total rows
- [ ] Show best hole (lowest score vs par)
- [ ] Show worst hole (highest score vs par)
- [ ] Show fairways hit % (if tracked)
- [ ] Show putts per hole average (if tracked)
- [ ] "Done" button → navigate to history or home
- [ ] Style with `StyleSheet` matching design system

---

## Story 1.6: User can view round history

### Task 1.6.1: Build Round History screen (`app/(tabs)/history.tsx`)
> *As a golfer, I want to browse all my past rounds so that I can track my progress and look back at specific games.*
- [ ] Create `app/(tabs)/history.tsx`
- [ ] Load all completed rounds on focus, sorted newest first
- [ ] Render empty state if no rounds
- [ ] Each round card: course name, date, score vs par, tee color badge
- [ ] Tap round card → navigate to `app/round/summary/[id].tsx`
- [ ] Style with `StyleSheet` matching design system

### Task 1.6.2: Register History tab in navigation
> *As a golfer, I want a History tab in the main navigation so that my past rounds are always one tap away.*
- [ ] Add `Tabs.Screen` for `history` in `app/(tabs)/_layout.tsx`
- [ ] Set icon (`time-outline` Ionicons)
- [ ] Set label "History"

### Task 1.6.3: Home screen stats
> *As a golfer, I want to see my key stats on the home screen so that I get a quick snapshot of my game every time I open the app.*
- [ ] Add "Rounds Played" count to Home screen
- [ ] Add "Scoring Average" (mean score vs par across all rounds) to Home screen
- [ ] Add "Best Round" (lowest score vs par) to Home screen
- [ ] Load stats on focus

---

## Story 1.7: App handles edge cases gracefully

### Task 1.7.1: 9-hole course support
> *As a golfer who plays 9-hole courses, I want the app to handle them correctly so that my scorecard and totals aren't broken.*
- [ ] Allow course creation with 9 holes (selector on Add Course screen)
- [ ] Scorecard correctly renders 9 rows with no Back 9 subtotal
- [ ] Round summary adjusts totals for 9 holes

### Task 1.7.2: Edit and delete rounds
> *As a golfer, I want to fix mistakes in a saved round or delete it entirely so that my history stays accurate.*
- [ ] Add "Edit Round" option on Round Summary screen
- [ ] Navigates back to Scorecard in edit mode (re-opens completed round)
- [ ] Allow re-saving over existing round
- [ ] Add "Delete Round" option with confirmation modal
- [ ] Remove from storage and navigate to History on confirm

### Task 1.7.3: Edit and delete courses
> *As a golfer, I want to delete a course I no longer need so that my courses list stays clean and relevant.*
- [ ] Add "Delete Course" option on Course Detail screen
- [ ] If course has rounds attached, show warning: "X rounds will also be deleted"
- [ ] On confirm: delete course and all associated rounds

---

## Story 1.8: User can view course statistics

> Stats are computed on-the-fly from completed rounds (filtered by `courseId`). No extra storage — derived from existing round data when the course detail screen loads.

### Task 1.8.1: Compute per-course stats from round history
> *As a golfer, I want to see how many times I've played a course and what I typically score there so that I can track my improvement on that specific course.*
- [ ] In `app/course/[id].tsx`, load all completed rounds on focus using `useFocusEffect`
- [ ] Filter rounds by `courseId === id`
- [ ] Compute:
  - `timesPlayed` — count of matching rounds
  - `averageScore` — mean total score vs par across all rounds (e.g. "+4.2")
  - `bestRound` — lowest score vs par across all rounds
- [ ] Show a stats strip below the summary strip (only visible when `timesPlayed > 0`)
- [ ] Hide stats strip entirely if course has never been played

### Task 1.8.2: Show average score per hole
> *As a golfer, I want to see my average score on each hole so that I know which holes are hurting me the most.*
- [ ] For each hole, compute average score across all rounds where that hole was played (score > 0)
- [ ] Display average next to each hole row in the hole list (e.g. "avg +1.2" or color-coded chip)
- [ ] Use the same color coding as the scorecard: eagle=gold, birdie=green, par=white, bogey=yellow, double+=red
- [ ] Show "—" if the hole has never been scored

### Task 1.8.3: Show round count on Courses list card
> *As a golfer, I want to see at a glance how many times I've played each course so that I can quickly find my most-played courses.*
- [ ] In `app/(tabs)/courses.tsx`, load rounds alongside courses on focus
- [ ] For each course card, compute round count from rounds filtered by `courseId`
- [ ] Display round count as a secondary badge on the card (e.g. "5 rounds" in muted text)
- [ ] Hide if count is 0

---

# EPIC 2: Handicap Calculator

---

## Story 2.1: App calculates handicap from round history

### Task 2.1.1: Add course rating fields to Course type
> *As a golfer, I want to store the course rating and slope for each tee so that the app can calculate an accurate handicap differential for each round.*
- [ ] Add `ratings` field to `Course` interface: `Record<Tee, TeeRatings>`
- [ ] `TeeRatings` = `{ courseRating: number; slope: number }`
- [ ] Update Course Edit screen to include Rating and Slope inputs per tee
- [ ] Add placeholder values (course rating 72.0, slope 113) when no value entered

### Task 2.1.2: Update HoleScore to store adjusted score
> *As a developer, I want each hole score to store its ESC-adjusted value so that the handicap calculation always uses the correct capped score.*
- [ ] Add `adjustedScore?: number` field to `HoleScore` type
- [ ] Adjusted score is gross score with ESC cap applied per hole

### Task 2.1.3: Build handicap service (`services/handicap.ts`)
> *As a golfer, I want the app to automatically calculate my handicap index from my round history so that I always have an accurate, up-to-date index without doing the math myself.*
- [ ] Create `services/handicap.ts`
- [ ] Write `getESCMax(currentHandicap: number): number`
  - [ ] 0–9 → return `par + 2` (double bogey)
  - [ ] 10–19 → return `7`
  - [ ] 20–29 → return `8`
  - [ ] 30–39 → return `9`
  - [ ] 40+ → return `10`
- [ ] Write `applyESC(holeScores: HoleScore[], currentHandicap: number): number` — sum adjusted scores
- [ ] Write `calculateDifferential(adjustedGross, courseRating, slope): number`
  - [ ] Formula: `(adjustedGross - courseRating) * 113 / slope`
  - [ ] Round to 1 decimal place
- [ ] Write `getDifferentialsToUse(roundCount: number): number` using WHS scaling table
- [ ] Write `calculateHandicapIndex(rounds: Round[]): number | null`
  - [ ] Return `null` if fewer than 3 rounds
  - [ ] Take last 20 rounds (or all if fewer)
  - [ ] Calculate differential for each round
  - [ ] Sort differentials ascending
  - [ ] Take lowest N per scaling table
  - [ ] Average × 0.96
  - [ ] Round to 1 decimal place
- [ ] Write `calculateCourseHandicap(index, slope, courseRating, par): number`
  - [ ] Formula: `Math.round(index * slope / 113 + (courseRating - par))`

---

## Story 2.2: User can view their handicap index

### Task 2.2.1: Handicap card on Home screen
> *As a golfer, I want to see my current handicap index on the home screen so that I always know where my game stands.*
- [ ] Add handicap card to `app/(tabs)/index.tsx`
- [ ] Load all rounds and calculate index on focus
- [ ] Show index prominently (e.g. "12.4")
- [ ] Show "Not enough rounds" if fewer than 3 rounds
- [ ] Show trend indicator: up/down arrow + delta vs previous calculation
- [ ] Style as a card matching design system

### Task 2.2.2: Handicap history screen (`app/handicap/history.tsx`)
> *As a golfer, I want to see how my handicap has changed over time so that I can track my long-term improvement.*
- [ ] Create `app/handicap/history.tsx`
- [ ] Show list of past rounds with differential for each
- [ ] Highlight the differentials currently being used in index calculation (green)
- [ ] Show index at each point in history
- [ ] Style with `StyleSheet` matching design system

---

## Story 2.3: User sees course handicap before and during a round

### Task 2.3.1: Show course handicap on Start Round screen
> *As a golfer, I want to see my course handicap before I tee off so that I know my net score target for the round.*
- [ ] After course and tee are selected, calculate course handicap
- [ ] Display below tee selector: "Your course handicap: 14"
- [ ] Show "—" if no handicap index yet

### Task 2.3.2: Show net score in Round Summary
> *As a golfer, I want to see my net score in the round summary so that I know how I played relative to my handicap.*
- [ ] Calculate net score: `grossScore - courseHandicap`
- [ ] Show net score row below gross score in Round Summary
- [ ] Label clearly as "Net Score"

### Task 2.3.3: Visual indicator after round
> *As a golfer, I want to know whether my handicap improved or got worse after each round so that I can see the immediate impact of my performance.*
- [ ] After Finish Round, compare new differential to current index
- [ ] Show banner: "Handicap improved by 0.3" or "Handicap increased by 0.5"
- [ ] Green for improvement, red for increase

---

# EPIC 3: Shot Tracking During a Round

---

## Story 3.1: User opts into shot tracking at round start

### Task 3.1.1: Add shot tracking toggle to Start Round screen
> *As a golfer, I want to choose whether to track individual shots before starting a round so that I'm never forced to log shots when I just want to keep score.*
- [ ] Add `Switch` component below tee selector labeled "Track Shots"
- [ ] Default value: `false`
- [ ] Persist last-used preference to AsyncStorage (`@shotTrackingEnabled`)
- [ ] Load persisted preference on mount
- [ ] Save preference whenever toggle changes
- [ ] Pass `shotTrackingEnabled` into `Round` object when starting

### Task 3.1.2: Define Shot type
> *As a developer, I want a Shot type with optional fields for club, distance, lie, and result so that users can log as much or as little detail as they want.*
- [ ] Add `Shot` interface to `constants/round.ts`
  - [ ] `shotNumber: number`
  - [ ] `clubId?: string`
  - [ ] `distance?: number`
  - [ ] `lie?: 'tee' | 'fairway' | 'rough' | 'sand' | 'recovery' | 'green'`
  - [ ] `result?: 'good' | 'short' | 'long' | 'left' | 'right'`
- [ ] Add `shots?: Shot[]` to `HoleScore` interface

---

## Story 3.2: User can log shots during a hole

### Task 3.2.1: Build Shot Tracker panel on Scorecard hole view
> *As a golfer tracking shots, I want to see a shot log on each hole so that I can quickly review what I've entered and add new shots.*
- [ ] In Scorecard, detect `round.shotTrackingEnabled`
- [ ] If enabled, show Shot Tracker panel below score input for current hole
- [ ] Panel shows list of shots entered: "Shot 1 · 7 Iron · 165 yds · Fairway"
- [ ] Panel shows "+ Add Shot" button
- [ ] Show "No shots logged" hint text if empty
- [ ] Tap shot row → open Shot Entry sheet in edit mode for that shot
- [ ] Swipe left on shot row → reveal Delete button

### Task 3.2.2: Build Shot Entry bottom sheet (`components/round/ShotEntry.tsx`)
> *As a golfer, I want a fast, minimal sheet for entering a shot so that logging it takes under 5 seconds and doesn't slow down play.*
- [ ] Create `components/round/` directory
- [ ] Create `components/round/ShotEntry.tsx`
- [ ] Accept props: `shotNumber`, `clubs`, `initialShot?`, `onSave`, `onClose`, `visible`
- [ ] Show shot number in header ("Shot 3")
- [ ] Club picker: horizontal scroll list of active club badges (tap to select, optional)
- [ ] "No Club" option to clear selection
- [ ] Distance input: large number pad, optional
- [ ] Lie selector: icon row — T / F / R / S / G — tap to select, optional
- [ ] Result selector: Good / Short / Long / Left / Right — tap to select, optional
- [ ] "Save Shot" button — saves with whatever fields are filled
- [ ] "Skip" button — saves shot with no data (increments shot count)
- [ ] "Cancel" button — discards and closes
- [ ] Style with `StyleSheet` matching design system

### Task 3.2.3: Wire Shot Entry to Scorecard state
> *As a golfer, I want my shot entries to save automatically so that I never lose data mid-round.*
- [ ] On "Save Shot": append or update shot in `HoleScore.shots[]`
- [ ] Auto-increment `shotNumber` for next shot
- [ ] Auto-save round to in-progress store after each shot
- [ ] On delete: remove shot from array, re-number remaining shots

---

## Story 3.3: User can navigate between scorecard, clubs, and shots during a round

### Task 3.3.1: Build in-round navigation layout
> *As a golfer, I want a dedicated navigation bar during a round so that I can quickly switch between my scorecard, club distances, and shot log without leaving the round.*
- [ ] Create `app/round/_layout.tsx` with a custom bottom tab bar
- [ ] Three tabs: Scorecard, Clubs, Shots (only show Shots tab if shot tracking on)
- [ ] Style tab bar matching design system (dark background, green active tint)
- [ ] Pass `roundId` context through layout

### Task 3.3.2: In-round Clubs screen
> *As a golfer mid-round, I want to quickly check my club distances without accidentally editing them so that I stay focused on playing.*
- [ ] Create `app/round/clubs.tsx` (read-only clubs view)
- [ ] Reuse `ClubCard` component
- [ ] Show "Read only during round" hint at top
- [ ] Disable all taps (no navigation to club detail)

### Task 3.3.3: In-round Shots summary screen
> *As a golfer, I want to see all the shots I've logged this round in one place so that I can review my game as it unfolds.*
- [ ] Create `app/round/shots.tsx`
- [ ] Show all shots logged this round grouped by hole
- [ ] Each hole section header: "Hole 7 · 3 shots"
- [ ] Each shot row: shot number, club, distance, lie, result
- [ ] Show total shots count for the round
- [ ] Style with `StyleSheet` matching design system

### Task 3.3.4: Exit Round flow
> *As a golfer, I want to exit a round and come back to it later so that I'm not locked into finishing in one sitting.*
- [ ] Add "Exit Round" button in Scorecard header (X icon)
- [ ] Show confirmation modal: "Exit round? Progress is saved and you can resume later."
- [ ] "Exit" → navigate back to Home tab, round stays in-progress store
- [ ] "Cancel" → dismiss modal, stay on scorecard

---

## Story 3.4: Shot data is saved and shown post-round

### Task 3.4.1: Include shot data in Finish Round save
> *As a golfer, I want my shot data saved permanently with the round so that I can review it any time in my round history.*
- [ ] Ensure `shots[]` on each `HoleScore` is included when moving to completed rounds store
- [ ] Shot data persists exactly as entered

### Task 3.4.2: Show shot breakdown in Round Summary
> *As a golfer, I want to see a per-hole shot breakdown in my round summary so that I can understand exactly how each hole played out.*
- [ ] If `shotTrackingEnabled`, show expandable shot log per hole in Round Summary
- [ ] Collapsed by default — tap hole row to expand
- [ ] Expanded: list each shot with club, distance, lie, result
- [ ] Show shots-per-hole average at top of summary

---

# EPIC 4: Shot Distance Averaging Per Club

---

## Story 4.1: App calculates average distances from shot history

### Task 4.1.1: Build shot stats service (`services/shotStats.ts`)
> *As a golfer, I want the app to automatically calculate how far I actually hit each club based on my real tracked shots so that my distances reflect my true game, not guesses.*
- [ ] Create `services/shotStats.ts`
- [ ] Write `getShotsForClub(clubId: string, rounds: Round[]): Shot[]`
  - [ ] Iterate all rounds → all holes → all shots
  - [ ] Filter by `shot.clubId === clubId`
  - [ ] Filter out shots with no `distance` value
  - [ ] Return flat array of matching shots
- [ ] Write `calculateSimpleAverage(shots: Shot[]): number`
  - [ ] Sum all distances, divide by count
  - [ ] Round to nearest integer
- [ ] Write `getSampleSize(clubId: string, rounds: Round[]): number`
  - [ ] Return count of shots with distance for that club
- [ ] Write `getWeightedPercentile(shots: Shot[], weights: number[], percentile: number): number`
  - [ ] Sort shots by distance ascending (keep weights paired to shots)
  - [ ] Calculate total weight: `Σ(weights)`
  - [ ] Walk sorted list accumulating weight until cumulative weight / total ≥ percentile / 100
  - [ ] Interpolate between the two surrounding distances at the threshold boundary
  - [ ] Round to nearest integer
  - [ ] **Note:** replaces the simple `getPercentile` — weighting must be applied here so the range reflects recent shot patterns, not historical ones. A flat sort over-represents old shots exactly the same way a simple average does.
- [ ] Write `calculateWeightedIQR(shots: Shot[], weights: number[]): { low: number; high: number }`
  - [ ] `low` = weighted 25th percentile distance
  - [ ] `high` = weighted 75th percentile distance
  - [ ] This is the range that 50% of shots fall within, skewed toward recent rounds
- [ ] Write `getClubStats(clubId, rounds, decay): { avg: number; weightedAvg: number; count: number; range: { low: number; high: number } | null } | null`
  - [ ] Return `null` if fewer than 5 shots with distance
  - [ ] Compute per-shot weights using `decay ^ ageInRounds` (same decay used for weighted average)
  - [ ] Include `avg` (simple), `weightedAvg`, and `count` as before
  - [ ] Include `range` from `calculateWeightedIQR` if ≥ 10 shots, otherwise `null`
  - [ ] Range and weighted average always use the same decay factor so they are consistent with each other

---

## Story 4.2: User can see tracked vs manual distances on Club Detail

### Task 4.2.1: Update Club Detail screen with tracked average
> *As a golfer, I want to see my tracked average distance alongside my manually entered distance so that I can tell when my real distances have drifted from what I originally entered.*
- [ ] Load all completed rounds on Club Detail mount
- [ ] Call `getClubStats` for this club
- [ ] If stats exist (≥ 5 shots):
  - [ ] Show "Manual: 165 yds" row
  - [ ] Show "Tracked avg: 158 yds · 12 shots" row
  - [ ] Show divergence warning if difference > 10 yds
- [ ] Add "Use Tracked Average" button
  - [ ] On press: update `entry.stats.distance` to tracked avg
  - [ ] Save via `saveClubData`

### Task 4.2.2: Show 50% shot distance range on Club Detail
> *As a golfer, I want to see the range that 50% of my shots fall within so that I know not just my average but how consistent I am with that club.*
- [ ] If `range` is present in `getClubStats` result (≥ 10 shots):
  - [ ] Display below the tracked average: "50% of shots: 175 – 205 yds"
  - [ ] Style range numbers in muted green to distinguish from the average
  - [ ] Add a small label: "middle 50% of your shots"
- [ ] If fewer than 10 shots: show "10 shots needed for range" instead
- [ ] Tooltip / info icon explaining what the range means:
  - [ ] "Half of all your tracked shots with this club landed between these two distances"

### Task 4.2.3: Show 50% range on Club Card (clubs tab)
> *As a golfer browsing my bag, I want to see the distance range on each club card so that I can quickly gauge consistency without opening the detail screen.*
- [ ] If range data exists for a club, show below the average chip: "175 – 205 yds (50%)"
- [ ] Use smaller, muted text so it doesn't compete with the average value
- [ ] Only show if shot tracking has produced ≥ 10 shots for that club

### Task 4.2.4: Show sample size indicator
> *As a golfer, I want to see how many shots are contributing to my average so that I know whether to trust the number yet.*
- [ ] Below tracked avg, show progress toward minimum thresholds
- [ ] If < 5 shots: "3/5 shots needed for average" with progress bar
- [ ] If 5–9 shots: show average but "Need 10 shots for range · 7/10"
- [ ] If ≥ 10: show full average, range, and shot count

---

## Story 4.3: Club recommendations prefer tracked averages

### Task 4.3.1: Update recommendation logic in Scorecard
> *As a golfer, I want club recommendations to use my real tracked distances when available so that suggestions are based on how I actually play, not what I hoped I could hit.*
- [ ] In `getClosestClub` logic, check if tracked avg exists for each club (sample ≥ 5)
- [ ] If yes, use tracked avg for distance comparison
- [ ] If no, fall back to manually entered distance
- [ ] Add "(tracked)" label next to recommendation when using tracked avg
- [ ] If range data exists for recommended club, show it below the tip:
  - [ ] "7 Iron · avg 165 yds · 50% land 155–175 yds"
  - [ ] Helps golfer decide whether the hole yardage falls comfortably in their range or on the edge

---

# EPIC 5: Weighted Recent Shot Averaging

---

## Story 5.1: App weights recent shots more heavily

### Task 5.1.1: Implement exponential decay weighting
> *As a golfer who is improving, I want recent shots to count more than old ones so that my average distance reflects my current ability, not shots I hit a year ago.*
- [ ] Add to `services/shotStats.ts`
- [ ] Define `DECAY_FACTORS` constant: `{ light: 0.95, medium: 0.9, heavy: 0.8 }`
- [ ] Write `getRoundAge(shot: Shot, rounds: Round[]): number` — how many rounds ago this shot was hit
- [ ] Write `calculateWeightedAverage(shots: Shot[], rounds: Round[], decay: number): number`
  - [ ] For each shot: `weight = decay ^ ageInRounds`
  - [ ] Weighted sum: `Σ(distance × weight)`
  - [ ] Weighted count: `Σ(weight)`
  - [ ] Result: `weightedSum / weightedCount`, rounded to integer
- [ ] Update `getClubStats` to return both `simpleAvg` and `weightedAvg`

---

## Story 5.2: User can control weighting aggressiveness

### Task 5.2.1: Add weighting setting to app settings
> *As a golfer, I want to control how strongly my recent shots are weighted so that I can tune the average to match how quickly my game is changing.*
- [ ] Create `app/settings.tsx`
- [ ] Add "Shot Weighting" section
- [ ] Three-option picker: Light / Medium (default) / Heavy
- [ ] Persist selection to AsyncStorage (`@shotWeighting`)
- [ ] Load on app start and make available app-wide

### Task 5.2.2: Show both averages on Club Detail
> *As a golfer, I want to see both my simple and weighted averages side by side so that I can understand the difference and decide which to trust.*
- [ ] Load weighting preference on Club Detail mount
- [ ] Show "Simple avg: 162 yds" and "Weighted avg: 158 yds (medium)"
- [ ] Weighted avg updates based on current weighting setting

### Task 5.2.3: Add plain-English explanation
> *As a golfer who isn't a statistician, I want a plain-English explanation of weighted averaging so that I understand what the number means and why it might differ from my simple average.*
- [ ] Add info icon next to "Weighted avg" label
- [ ] Tap → show modal explaining weighted average in plain English
- [ ] Include example: "A shot from last week counts twice as much as one from 8 rounds ago"

---

# EPIC 6: Environmental Conditions & Home Baseline

---

## Story 6.1: User designates a home course with baseline conditions

### Task 6.1.1: Add Home Course toggle to Course Detail
> *As a golfer, I want to designate one course as my home course so that the app knows what normal conditions look like for me and can calculate adjustments when I play elsewhere.*
- [ ] Add "Set as Home Course" toggle in Course Detail screen
- [ ] Only one course can be Home at a time — toggling one clears the previous
- [ ] Persist `isHome` flag via `saveCourses`
- [ ] Show home badge on My Courses list for the home course

### Task 6.1.2: Build Home Baseline settings (`app/home-baseline.tsx`)
> *As a golfer, I want to enter my typical playing temperature and elevation at home so that the app has a baseline to compare against when I play in different conditions.*
- [ ] Create `app/home-baseline.tsx`
- [ ] Load home course name and display it at top
- [ ] Input: typical playing temperature (°F)
- [ ] Input: course elevation (ft above sea level)
- [ ] Input: typical humidity (%) — optional
- [ ] Save to AsyncStorage (`@homeBaseline`)
- [ ] Accessible from app settings or Course Detail of home course

---

## Story 6.2: User enters conditions before a round

### Task 6.2.1: Add Conditions step to Start Round flow
> *As a golfer, I want to enter today's weather conditions before a round so that the app can tell me how far I'll actually hit each club given the temperature, wind, and altitude.*
- [ ] After tee selection, add "Conditions" section (collapsible, optional)
- [ ] Input: temperature (°F) — number pad
- [ ] Input: wind speed (mph) — number pad
- [ ] Wind direction selector: Calm / Headwind / Tailwind / Crosswind
- [ ] Input: humidity (%) — optional
- [ ] Course elevation auto-populated from course data if entered, editable
- [ ] "Skip Conditions" option to proceed with no data
- [ ] Store conditions in `Round.conditions`

### Task 6.2.2: Define Conditions type
> *As a developer, I want a Conditions type on the Round so that every part of the app — recommendations, history, insights — can access weather data for any given round.*
- [ ] Add `Conditions` interface to `constants/round.ts`
  - [ ] `temperature?: number`
  - [ ] `windSpeed?: number`
  - [ ] `windDirection?: 'calm' | 'headwind' | 'tailwind' | 'crosswind'`
  - [ ] `humidity?: number`
  - [ ] `elevation?: number`
- [ ] Add `conditions?: Conditions` to `Round` interface

---

## Story 6.3: App adjusts distances based on conditions

### Task 6.3.1: Build conditions adjustment engine (`services/conditions.ts`)
> *As a golfer, I want the app to automatically calculate how conditions will affect my distances so that I know exactly how much to adjust my club selection without having to do the math.*
- [ ] Create `services/conditions.ts`
- [ ] Define adjustment constants:
  - [ ] `TEMP_YARDS_PER_10F = 1`
  - [ ] `ALTITUDE_PERCENT_PER_1000FT = 0.01`
  - [ ] `WIND_PERCENT_PER_MPH = 0.01`
  - [ ] `HUMIDITY_MAX_EFFECT = 2`
- [ ] Write `calculateTempAdjustment(base, currentTemp, homeTemp): number`
- [ ] Write `calculateAltitudeAdjustment(base, currentElevation, homeElevation): number`
- [ ] Write `calculateWindAdjustment(base, windSpeed, windDirection): number`
- [ ] Write `calculateHumidityAdjustment(base, humidity): number`
- [ ] Write `calculateAdjustedDistance(base: number, home: Conditions, current: Conditions): number`
  - [ ] Sum all four adjustments
  - [ ] Add to base distance
  - [ ] Round to nearest integer
  - [ ] Never return less than 1
- [ ] Write `describeAdjustment(home, current): string` — e.g. "cold + headwind"

---

## Story 6.4: User sees adjusted recommendations during a round

### Task 6.4.1: Adjusted club tips on Scorecard
> *As a golfer playing in unusual conditions, I want the scorecard to show me adjusted distances so that I automatically club up or down without having to think about it.*
- [ ] Load home baseline + round conditions on Scorecard mount
- [ ] If both exist, calculate adjusted distance for recommended club
- [ ] Show: "7 Iron · 165 yds normally → ~158 yds today (cold + headwind)"
- [ ] If no conditions entered, show standard recommendation

### Task 6.4.2: Today's Conditions banner on Clubs tab
> *As a golfer mid-round, I want to see condition-adjusted distances for all my clubs so that I can make accurate decisions on any shot, not just the recommended one.*
- [ ] If there is an active in-progress round with conditions entered:
  - [ ] Show banner at top of Clubs screen: "Conditions active: 45°F · 12mph headwind"
  - [ ] Each club card shows adjusted distance below normal distance
  - [ ] Adjusted value in green, normal in muted gray
- [ ] Banner dismissible (X button) for the session

### Task 6.4.3: Conditions calculator on Club Detail screen
> *As a golfer, I want to experiment with different conditions on a club's detail page so that I can prepare for upcoming rounds in different locations or seasons.*
- [ ] Add "Conditions Calculator" section at bottom of Club Detail
- [ ] Inputs: Temp, Wind speed, Wind direction, Elevation
- [ ] Live-updating result: "At these conditions: ~152 yds"
- [ ] Show breakdown: "+3 altitude, −7 cold, −6 headwind"
- [ ] Reset button to clear inputs

---

## Story 6.5: User sees insights from conditions history

### Task 6.5.1: Conditions history log
> *As a golfer, I want to see what conditions were like for each past round so that I have context when reviewing old scores.*
- [ ] In Round History, show conditions badge on each round card if recorded
- [ ] Tap round → conditions shown in Round Summary header

### Task 6.5.2: Adjusted distance alert on Clubs screen
> *As a golfer heading to a round in unusual conditions, I want a clear heads-up that I'll be hitting shorter or longer than usual so that I don't get caught off guard on the course.*
- [ ] When total adjustment > 10 yds different from home baseline:
  - [ ] Show alert banner: "You're playing ~12 yds shorter than at home — consider clubbing up"

### Task 6.5.3: Scoring vs conditions correlation
> *As a golfer, I want to see how my scores compare across different weather conditions so that I can understand whether cold or wind is hurting my game more than I think.*
- [ ] Define thresholds: Cold (<50°F), Mild (50–75°F), Warm (>75°F)
- [ ] Calculate average score vs par per temperature band
- [ ] Display: "You avg +8 in cold, +6 in mild, +5 in warm"
- [ ] Only show if ≥ 3 rounds per band

---

## Completed

- **Story 1.1** — User can create a golf course (`constants/course.ts`, `services/courseStorage.ts`, `app/(tabs)/courses.tsx`, `app/course/new.tsx`, `app/course/[id].tsx`)
- **Story 1.2** — User can view and edit hole details (`components/course/HoleEditor.tsx`, `app/course/[id].tsx` full impl, `app/course/edit/[id].tsx`)
- **Story 1.3** — User can start a new round (`constants/round.ts`, `services/roundStorage.ts`, `app/round/new.tsx`, `app/(tabs)/index.tsx` home screen)
