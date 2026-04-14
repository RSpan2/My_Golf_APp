# My Golf App — Task List

Hierarchy: **Epic → Story → Task → Step** (smallest unit)

---

## Status

- [ ] Not started
- [~] In progress
- [x] Complete

---

# EPIC 1: Scorecard & Round Tracking

---

## Story 1.1: User can create a golf course

### Task 1.1.1: Define course data types (`constants/course.ts`)
- [ ] Create `constants/course.ts` file
- [ ] Define `Tee` union type: `'blue' | 'white' | 'red' | 'gold'`
- [ ] Define `TeeRatings` interface: `{ courseRating: number; slope: number }`
- [ ] Define `HoleYardages` interface: `{ blue?: number; white?: number; red?: number; gold?: number }`
- [ ] Define `Hole` interface with fields: `number`, `par`, `yardages`, `handicapIndex`
- [ ] Define `Course` interface with fields: `id`, `name`, `city`, `state`, `holes`, `isHome`, `ratings` (per tee)
- [ ] Export all types

### Task 1.1.2: Create course storage service (`services/courseStorage.ts`)
- [ ] Create `services/courseStorage.ts` file
- [ ] Define `COURSES_KEY` and `ROUNDS_KEY` AsyncStorage constants
- [ ] Write `loadCourses(): Promise<Course[]>` — parse JSON or return `[]`
- [ ] Write `saveCourses(courses: Course[]): Promise<void>` — stringify and store
- [ ] Write `getCourseById(id: string): Promise<Course | undefined>`
- [ ] Write `deleteCourse(id: string): Promise<void>` — filter and re-save
- [ ] Export all functions

### Task 1.1.3: Build Add Course screen (`app/course/new.tsx`)
- [ ] Create `app/course/new.tsx` file
- [ ] Add `SafeAreaView` container with dark background
- [ ] Add header with back button and "New Course" title
- [ ] Add `TextInput` for course name
- [ ] Add `TextInput` for city
- [ ] Add `TextInput` for state (2-char, auto-caps)
- [ ] Add number of holes selector (9 or 18, default 18)
- [ ] On save: generate `uuid`-style id (`Date.now().toString()`)
- [ ] On save: build default holes array (all par 4, yardages 0, handicapIndex 1–18)
- [ ] On save: call `saveCourses` and navigate back
- [ ] Disable save button if course name is empty
- [ ] Style all elements with `StyleSheet` matching design system

### Task 1.1.4: Build My Courses screen (`app/(tabs)/courses.tsx`)
- [ ] Create `app/(tabs)/courses.tsx` file
- [ ] Add `SafeAreaView` container
- [ ] Add header with "Courses" title and "+" add button
- [ ] Load courses on focus with `useFocusEffect`
- [ ] Render empty state if no courses saved
- [ ] Render each course as a card (name, city/state, hole count)
- [ ] Tap card → navigate to `app/course/[id].tsx`
- [ ] Tap "+" → navigate to `app/course/new.tsx`
- [ ] Style with `StyleSheet` matching design system

### Task 1.1.5: Register Courses tab in navigation (`app/(tabs)/_layout.tsx`)
- [ ] Open `app/(tabs)/_layout.tsx`
- [ ] Add a third `Tabs.Screen` entry for `courses`
- [ ] Set tab icon (`map-outline` from Ionicons)
- [ ] Set tab label "Courses"

---

## Story 1.2: User can view and edit hole details

### Task 1.2.1: Build Course Detail screen (`app/course/[id].tsx`)
- [ ] Create `app/course/[id].tsx` file
- [ ] Load course by `id` param on mount
- [ ] Add header: back button, course name, "Edit" button
- [ ] Show summary row: total yardage (white tee), total par, number of holes
- [ ] Render list of 18 holes, each showing hole number, par, white yardage
- [ ] Tap a hole row → open Hole Editor modal
- [ ] Style with `StyleSheet` matching design system

### Task 1.2.2: Build Hole Editor modal (`components/course/HoleEditor.tsx`)
- [ ] Create `components/course/` directory
- [ ] Create `components/course/HoleEditor.tsx`
- [ ] Accept props: `hole`, `onSave(updatedHole)`, `onClose`, `visible`
- [ ] Show hole number in header
- [ ] Add Par selector: 3-button toggle (3 / 4 / 5), highlight active
- [ ] Add yardage inputs for each tee: Blue, White, Red, Gold (number pad)
- [ ] Add Handicap Index input: number 1–18
- [ ] "Save" button calls `onSave` and closes
- [ ] "Cancel" button discards changes and closes
- [ ] Style with `StyleSheet` matching design system

### Task 1.2.3: Wire Hole Editor save back to storage
- [ ] In `app/course/[id].tsx`, maintain local `course` state
- [ ] On `HoleEditor` save: replace hole in `course.holes` array by index
- [ ] Call `saveCourses` with updated course
- [ ] Re-render course detail list to reflect changes

### Task 1.2.4: Build Course Edit screen (name/city/state/ratings)
- [ ] Add edit form fields for course name, city, state
- [ ] Add rating inputs per tee: Course Rating (decimal, e.g. 72.4) and Slope Rating (integer)
- [ ] Show only tees that have at least one yardage entered
- [ ] Save updates to storage on submit

---

## Story 1.3: User can start a new round

### Task 1.3.1: Define Round and HoleScore types (`constants/round.ts`)
- [ ] Create `constants/round.ts` file
- [ ] Define `HoleScore` interface: `hole`, `par`, `yardage`, `score`, `putts?`, `fairwayHit?`, `adjustedScore?`
- [ ] Define `Round` interface: `id`, `courseId`, `courseName`, `date`, `tee`, `holes`, `shotTrackingEnabled`, `conditions?`
- [ ] Export all types

### Task 1.3.2: Add round persistence to storage service
- [ ] Add `loadRounds(): Promise<Round[]>` to `courseStorage.ts`
- [ ] Add `saveRound(round: Round): Promise<void>` — upsert by id
- [ ] Add `deleteRound(id: string): Promise<void>`
- [ ] Add `loadInProgressRound(): Promise<Round | null>` — separate key for active round
- [ ] Add `saveInProgressRound(round: Round | null): Promise<void>`

### Task 1.3.3: Build Start Round screen (`app/round/new.tsx`)
- [ ] Create `app/round/new.tsx` file
- [ ] Load saved courses on mount
- [ ] Render course picker list (cards, tap to select, highlight selected)
- [ ] Show empty state if no courses saved with link to add one
- [ ] Add tee color selector row: Blue / White / Red / Gold (tap to select)
- [ ] Auto-hide tee options that have no yardages entered on the course
- [ ] Date field defaulting to today (display only for now)
- [ ] "Shot Tracking" toggle (off by default, persists last value)
- [ ] "Start Round" button (disabled until course + tee selected)
- [ ] On start: build `Round` object with empty `HoleScore[]` for each hole
- [ ] Save to `inProgressRound` in AsyncStorage
- [ ] Navigate to `app/round/[id].tsx`
- [ ] Style with `StyleSheet` matching design system

### Task 1.3.4: Prompt to resume in-progress round
- [ ] On app launch in `app/(tabs)/index.tsx`, check `loadInProgressRound()`
- [ ] If found, show "Resume Round" banner with course name and date
- [ ] "Resume" button → navigate to `app/round/[id].tsx`
- [ ] "Discard" button → clear in-progress round and dismiss banner

---

## Story 1.4: User can enter scores hole by hole

### Task 1.4.1: Build Scorecard screen (`app/round/[id].tsx`)
- [ ] Create `app/round/[id].tsx` file
- [ ] Load round by id (from in-progress store or completed rounds)
- [ ] Add header: course name, tee color badge, score vs par (running total)
- [ ] Render scrollable hole list
- [ ] Each hole row shows: hole number, par, yardage, score input
- [ ] Score input: "-" button, score display, "+" button
- [ ] Minimum score: 1. No maximum enforced.
- [ ] Auto-save to in-progress store on every score change
- [ ] Add Front 9 subtotal row after hole 9
- [ ] Add Back 9 subtotal row after hole 18
- [ ] Add Total row at bottom
- [ ] Style with `StyleSheet` matching design system

### Task 1.4.2: Score color coding
- [ ] Write `getScoreColor(score: number, par: number): string` utility
- [ ] Eagle or better (≤ par − 2) → `#facc15` (gold)
- [ ] Birdie (par − 1) → `#4ade80` (green)
- [ ] Par → `#ffffff` (white)
- [ ] Bogey (par + 1) → `#fbbf24` (yellow)
- [ ] Double bogey+ (≥ par + 2) → `#f87171` (red)
- [ ] Apply color to score display in each hole row
- [ ] Apply color to score bubble background (subtle tint)

### Task 1.4.3: Putts and fairway tracking (optional fields)
- [ ] Add expandable row per hole for optional stats
- [ ] Putts input: "-" / number / "+" (0–6)
- [ ] Fairway Hit toggle: show only on par 4s and 5s (not par 3s)
- [ ] Fairway options: Hit / Miss Left / Miss Right
- [ ] Collapsed by default, tap hole row to expand
- [ ] Save putts and fairwayHit to `HoleScore`

### Task 1.4.4: Club recommendation per hole
- [ ] Load user's active clubs + distances on scorecard mount
- [ ] For each hole, find club whose `distance` stat is closest to hole yardage
- [ ] Show recommendation below yardage: "7 Iron · 165 yds"
- [ ] Only show if user has distances for ≥ 3 clubs
- [ ] Hide recommendation if hole yardage is 0 (not set)

### Task 1.4.5: Finish Round flow
- [ ] Add "Finish Round" button (sticky at bottom of scorecard)
- [ ] Show confirmation modal: "Are you sure? This will save and close the round."
- [ ] On confirm: move round from in-progress store to completed rounds store
- [ ] Navigate to Round Summary screen
- [ ] Clear in-progress round from AsyncStorage

---

## Story 1.5: User can view a round summary

### Task 1.5.1: Build Round Summary screen (`app/round/summary/[id].tsx`)
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
- [ ] Create `app/(tabs)/history.tsx`
- [ ] Load all completed rounds on focus, sorted newest first
- [ ] Render empty state if no rounds
- [ ] Each round card: course name, date, score vs par, tee color badge
- [ ] Tap round card → navigate to `app/round/summary/[id].tsx`
- [ ] Style with `StyleSheet` matching design system

### Task 1.6.2: Register History tab in navigation
- [ ] Add `Tabs.Screen` for `history` in `app/(tabs)/_layout.tsx`
- [ ] Set icon (`time-outline` Ionicons)
- [ ] Set label "History"

### Task 1.6.3: Home screen stats
- [ ] Add "Rounds Played" count to Home screen
- [ ] Add "Scoring Average" (mean score vs par across all rounds) to Home screen
- [ ] Add "Best Round" (lowest score vs par) to Home screen
- [ ] Load stats on focus

---

## Story 1.7: App handles edge cases gracefully

### Task 1.7.1: 9-hole course support
- [ ] Allow course creation with 9 holes (selector on Add Course screen)
- [ ] Scorecard correctly renders 9 rows with no Back 9 subtotal
- [ ] Round summary adjusts totals for 9 holes

### Task 1.7.2: Edit and delete rounds
- [ ] Add "Edit Round" option on Round Summary screen
- [ ] Navigates back to Scorecard in edit mode (re-opens completed round)
- [ ] Allow re-saving over existing round
- [ ] Add "Delete Round" option with confirmation modal
- [ ] Remove from storage and navigate to History on confirm

### Task 1.7.3: Edit and delete courses
- [ ] Add "Delete Course" option on Course Detail screen
- [ ] If course has rounds attached, show warning: "X rounds will also be deleted"
- [ ] On confirm: delete course and all associated rounds

---

# EPIC 2: Handicap Calculator

---

## Story 2.1: App calculates handicap from round history

### Task 2.1.1: Add course rating fields to Course type
- [ ] Add `ratings` field to `Course` interface: `Record<Tee, TeeRatings>`
- [ ] `TeeRatings` = `{ courseRating: number; slope: number }`
- [ ] Update Hole Editor / Course Edit screen to include Rating and Slope inputs per tee
- [ ] Add placeholder values (course rating 72.0, slope 113) when no value entered

### Task 2.1.2: Update HoleScore to store adjusted score
- [ ] Add `adjustedScore?: number` field to `HoleScore` type
- [ ] Adjusted score is gross score with ESC cap applied

### Task 2.1.3: Build handicap service (`services/handicap.ts`)
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
- [ ] Add handicap card to `app/(tabs)/index.tsx`
- [ ] Load all rounds and calculate index on focus
- [ ] Show index prominently (e.g. "12.4")
- [ ] Show "Not enough rounds" if fewer than 3 rounds
- [ ] Show trend indicator: up/down arrow + delta vs previous calculation
- [ ] Style as a card matching design system

### Task 2.2.2: Handicap history screen (`app/handicap/history.tsx`)
- [ ] Create `app/handicap/history.tsx`
- [ ] Show list of past rounds with differential for each
- [ ] Highlight the differentials currently being used in index calculation (green)
- [ ] Show index at each point in history
- [ ] Style with `StyleSheet` matching design system

---

## Story 2.3: User sees course handicap before and during a round

### Task 2.3.1: Show course handicap on Start Round screen
- [ ] After course and tee are selected, calculate course handicap
- [ ] Display below tee selector: "Your course handicap: 14"
- [ ] Show "—" if no handicap index yet

### Task 2.3.2: Show net score in Round Summary
- [ ] Calculate net score: `grossScore - courseHandicap`
- [ ] Show net score row below gross score in Round Summary
- [ ] Label clearly as "Net Score"

### Task 2.3.3: Visual indicator after round
- [ ] After Finish Round, compare new differential to current index
- [ ] Show banner: "Handicap improved by 0.3" or "Handicap increased by 0.5"
- [ ] Green for improvement, red for increase

---

# EPIC 3: Shot Tracking During a Round

---

## Story 3.1: User opts into shot tracking at round start

### Task 3.1.1: Add shot tracking toggle to Start Round screen
- [ ] Add `Switch` component below tee selector labeled "Track Shots"
- [ ] Default value: `false`
- [ ] Persist last-used preference to AsyncStorage (`@shotTrackingEnabled`)
- [ ] Load persisted preference on mount
- [ ] Save preference whenever toggle changes
- [ ] Pass `shotTrackingEnabled` into `Round` object when starting

### Task 3.1.2: Define Shot type
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
- [ ] In Scorecard, detect `round.shotTrackingEnabled`
- [ ] If enabled, show Shot Tracker panel below score input for current hole
- [ ] Panel shows list of shots entered: "Shot 1 · 7 Iron · 165 yds · Fairway"
- [ ] Panel shows "+ Add Shot" button
- [ ] Show "No shots logged" hint text if empty
- [ ] Tap shot row → open Shot Entry sheet in edit mode for that shot
- [ ] Swipe left on shot row → reveal Delete button

### Task 3.2.2: Build Shot Entry bottom sheet (`components/round/ShotEntry.tsx`)
- [ ] Create `components/round/` directory
- [ ] Create `components/round/ShotEntry.tsx`
- [ ] Accept props: `shotNumber`, `clubs`, `initialShot?`, `onSave`, `onClose`, `visible`
- [ ] Show shot number in header ("Shot 3")
- [ ] Club picker: horizontal scroll list of active club badges (tap to select, optional)
- [ ] "No Club" option to clear selection
- [ ] Distance input: large number pad, optional
- [ ] Lie selector: icon row — T (tee) / F (fairway) / R (rough) / S (sand) / G (green) — tap to select, optional
- [ ] Result selector: Good / Short / Long / Left / Right — tap to select, optional
- [ ] "Save Shot" button — saves with whatever fields are filled
- [ ] "Skip" button — saves shot with no data (increments shot count)
- [ ] "Cancel" button — discards and closes
- [ ] Style with `StyleSheet` matching design system

### Task 3.2.3: Wire Shot Entry to Scorecard state
- [ ] On "Save Shot": append or update shot in `HoleScore.shots[]`
- [ ] Auto-increment `shotNumber` for next shot
- [ ] Auto-save round to in-progress store after each shot
- [ ] On delete: remove shot from array, re-number remaining shots

---

## Story 3.3: User can navigate between scorecard, clubs, and shots during a round

### Task 3.3.1: Build in-round navigation layout
- [ ] Create `app/round/_layout.tsx` with a custom bottom tab bar (not the main app tabs)
- [ ] Three tabs: Scorecard, Clubs, Shots (only show Shots tab if shot tracking on)
- [ ] Style tab bar matching design system (dark background, green active tint)
- [ ] Pass `roundId` context through layout

### Task 3.3.2: In-round Clubs screen
- [ ] Create `app/round/clubs.tsx` (read-only clubs view)
- [ ] Reuse `ClubCard` component
- [ ] Show "Read only during round" hint at top
- [ ] Disable all taps (no navigation to club detail)

### Task 3.3.3: In-round Shots summary screen
- [ ] Create `app/round/shots.tsx`
- [ ] Show all shots logged this round grouped by hole
- [ ] Each hole section header: "Hole 7 · 3 shots"
- [ ] Each shot row: shot number, club, distance, lie, result
- [ ] Show total shots count for the round
- [ ] Style with `StyleSheet` matching design system

### Task 3.3.4: Exit Round flow
- [ ] Add "Exit Round" button in Scorecard header (X icon)
- [ ] Show confirmation modal: "Exit round? Progress is saved and you can resume later."
- [ ] "Exit" → navigate back to Home tab, round stays in-progress store
- [ ] "Cancel" → dismiss modal, stay on scorecard

---

## Story 3.4: Shot data is saved and shown post-round

### Task 3.4.1: Include shot data in Finish Round save
- [ ] Ensure `shots[]` on each `HoleScore` is included when moving to completed rounds store
- [ ] Shot data persists exactly as entered

### Task 3.4.2: Show shot breakdown in Round Summary
- [ ] If `shotTrackingEnabled`, show expandable shot log per hole in Round Summary
- [ ] Collapsed by default — tap hole row to expand
- [ ] Expanded: list each shot with club, distance, lie, result
- [ ] Show shots-per-hole average at top of summary

---

# EPIC 4: Shot Distance Averaging Per Club

---

## Story 4.1: App calculates average distances from shot history

### Task 4.1.1: Build shot stats service (`services/shotStats.ts`)
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
- [ ] Write `getClubStats(clubId: string, rounds: Round[]): { avg: number; count: number } | null`
  - [ ] Return `null` if fewer than 5 shots with distance
  - [ ] Otherwise return `{ avg, count }`

---

## Story 4.2: User can see tracked vs manual distances on Club Detail

### Task 4.2.1: Update Club Detail screen with tracked average
- [ ] Load all completed rounds on Club Detail mount
- [ ] Call `getClubStats` for this club
- [ ] If stats exist (≥ 5 shots):
  - [ ] Show "Manual: 165 yds" row (current entered value)
  - [ ] Show "Tracked avg: 158 yds · 12 shots" row
  - [ ] Show divergence warning if difference > 10 yds: "Your tracked avg differs by 7 yds"
- [ ] Add "Use Tracked Average" button
  - [ ] On press: update `entry.stats.distance` to tracked avg
  - [ ] Save via `saveClubData`
  - [ ] Show confirmation toast / flash

### Task 4.2.2: Show sample size indicator
- [ ] Below tracked avg, show progress toward 5-shot threshold
- [ ] If < 5 shots: "3/5 shots needed for average" with progress bar
- [ ] If ≥ 5: show full average with shot count

---

## Story 4.3: Club recommendations prefer tracked averages

### Task 4.3.1: Update recommendation logic in Scorecard
- [ ] In `getClosestClub` logic, check if tracked avg exists for each club (sample ≥ 5)
- [ ] If yes, use tracked avg for distance comparison
- [ ] If no, fall back to manually entered distance
- [ ] Add "(tracked)" label next to recommendation when using tracked avg

---

# EPIC 5: Weighted Recent Shot Averaging

---

## Story 5.1: App weights recent shots more heavily

### Task 5.1.1: Implement exponential decay weighting
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
- [ ] Create `app/settings.tsx` (or add to existing settings if one exists)
- [ ] Add "Shot Weighting" section
- [ ] Three-option picker: Light / Medium (default) / Heavy
- [ ] Persist selection to AsyncStorage (`@shotWeighting`)
- [ ] Load on app start and make available app-wide

### Task 5.2.2: Show both averages on Club Detail
- [ ] Load weighting preference on Club Detail mount
- [ ] Show "Simple avg: 162 yds" and "Weighted avg: 158 yds (medium weighting)"
- [ ] Weighted avg updates dynamically based on current weighting setting

### Task 5.2.3: Add plain-English explanation
- [ ] Add info icon next to "Weighted avg" label
- [ ] Tap → show modal: "Weighted average gives more importance to your most recent shots. 'Heavy' weighting means rounds from 6+ months ago barely affect your average."

---

# EPIC 6: Environmental Conditions & Home Baseline

---

## Story 6.1: User designates a home course with baseline conditions

### Task 6.1.1: Add Home Course toggle to Course Detail
- [ ] Add "Set as Home Course" toggle in Course Detail screen
- [ ] Only one course can be Home at a time — toggling one clears the previous
- [ ] Persist `isHome` flag via `saveCourses`
- [ ] Show home badge on My Courses list for the home course

### Task 6.1.2: Build Home Baseline settings (`app/home-baseline.tsx`)
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
- [ ] After tee selection, add "Conditions" section (collapsible, optional)
- [ ] Input: temperature (°F) — number pad
- [ ] Input: wind speed (mph) — number pad
- [ ] Wind direction selector: Calm / Headwind / Tailwind / Crosswind (tap to select)
- [ ] Input: humidity (%) — optional number pad
- [ ] Course elevation auto-populated from course data if entered, editable
- [ ] "Skip Conditions" option to collapse section and proceed with no data
- [ ] Store conditions in `Round.conditions` field

### Task 6.2.2: Define Conditions type
- [ ] Add `Conditions` interface to `constants/round.ts`
  - [ ] `temperature?: number` (°F)
  - [ ] `windSpeed?: number` (mph)
  - [ ] `windDirection?: 'calm' | 'headwind' | 'tailwind' | 'crosswind'`
  - [ ] `humidity?: number` (%)
  - [ ] `elevation?: number` (ft above sea level)
- [ ] Add `conditions?: Conditions` to `Round` interface

---

## Story 6.3: App adjusts distances based on conditions

### Task 6.3.1: Build conditions adjustment engine (`services/conditions.ts`)
- [ ] Create `services/conditions.ts`
- [ ] Define adjustment constants:
  - [ ] `TEMP_YARDS_PER_10F = 1` (colder = shorter, warmer = longer)
  - [ ] `ALTITUDE_PERCENT_PER_1000FT = 0.01` (1% longer per 1,000 ft)
  - [ ] `WIND_PERCENT_PER_MPH = 0.01` (headwind = shorter, tailwind = longer)
  - [ ] `HUMIDITY_MAX_EFFECT = 2` (minor, max 2 yds)
- [ ] Write `calculateTempAdjustment(base, currentTemp, homeTemp): number`
- [ ] Write `calculateAltitudeAdjustment(base, currentElevation, homeElevation): number`
- [ ] Write `calculateWindAdjustment(base, windSpeed, windDirection): number`
- [ ] Write `calculateHumidityAdjustment(base, humidity): number`
- [ ] Write `calculateAdjustedDistance(base: number, home: Conditions, current: Conditions): number`
  - [ ] Sum all adjustments and add to base
  - [ ] Round to nearest integer
  - [ ] Never return less than 1
- [ ] Write `describeAdjustment(home, current): string` — human-readable summary (e.g. "cold + headwind")

---

## Story 6.4: User sees adjusted recommendations during a round

### Task 6.4.1: Adjusted club tips on Scorecard
- [ ] Load home baseline + round conditions on Scorecard mount
- [ ] If both exist, calculate adjusted distance for recommended club
- [ ] Show: "7 Iron · 165 yds normally → ~158 yds today (cold + headwind)"
- [ ] If no conditions entered, show standard recommendation

### Task 6.4.2: Today's Conditions banner on Clubs tab
- [ ] If there is an active in-progress round with conditions entered:
  - [ ] Show a banner at top of Clubs screen: "Conditions active: 45°F · 12mph headwind"
  - [ ] Each club card shows adjusted distance below normal distance
  - [ ] Adjusted value in green, normal value in muted gray
- [ ] Banner dismissible (X button) for the session

### Task 6.4.3: Conditions calculator on Club Detail screen
- [ ] Add "Conditions Calculator" section at bottom of Club Detail
- [ ] Inputs: Temp, Wind speed, Wind direction, Elevation
- [ ] Live-updating result: "At these conditions: ~152 yds"
- [ ] Show breakdown: "+3 altitude, −7 cold, −6 headwind"
- [ ] Reset button to clear inputs

---

## Story 6.5: User sees insights from conditions history

### Task 6.5.1: Conditions history log
- [ ] In Round History, show conditions badge on each round card if conditions were recorded
- [ ] Tap round → conditions shown in Round Summary header

### Task 6.5.2: Adjusted distance alert on Clubs screen
- [ ] When conditions are significantly different from home baseline (> 10 yds total adjustment):
  - [ ] Show alert banner: "You're playing ~12 yds shorter than at home today — consider clubbing up"

### Task 6.5.3: Scoring vs conditions correlation (stretch goal)
- [ ] In Round History, show average score vs par in warm weather vs cold weather
- [ ] Define thresholds: Cold (<50°F), Mild (50–75°F), Warm (>75°F)
- [ ] Display as simple stat: "You avg +8 in cold, +6 in mild, +5 in warm"

---

## Completed

_Nothing completed yet._
