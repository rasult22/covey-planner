# QA Test Cases - Principle-Centered Planner

## Overview

This document contains comprehensive test cases for the Principle-Centered Planner app. The app implements time management principles including quadrants, priorities, and big rocks.

**App Version**: Expo ~54.0
**Last Updated**: 2026-01-28
**Total Test Cases**: ~180

---

## Table of Contents

1. [Onboarding Flow](#1-onboarding-flow) - CRITICAL
2. [Daily Planning (Today Tab)](#2-daily-planning-today-tab) - CRITICAL
3. [Weekly Planning (Week Tab)](#3-weekly-planning-week-tab) - CRITICAL
4. [Matrix Visualization](#4-matrix-visualization) - HIGH
5. [Goals Management](#5-goals-management) - HIGH
6. [Profile & Gamification](#6-profile--gamification) - HIGH
7. [Analytics & Reflection](#7-analytics--reflection) - MEDIUM
8. [Settings & Data Management](#8-settings--data-management) - MEDIUM
9. [Wiki / Help System](#9-wiki--help-system) - LOW
10. [Edge Cases & Error Handling](#10-edge-cases--error-handling) - HIGH

---

## Test Case Legend

- **Status**: `[ ]` Not tested, `[x]` Passed, `[!]` Failed, `[?]` Blocked
- **Priority**: CRITICAL > HIGH > MEDIUM > LOW

---

## 1. Onboarding Flow

**Priority: CRITICAL**
**Path**: `app/(onboarding)/`

### 1.1 Welcome Screen

| ID | Status | Test Case | Steps | Expected Result |
|----|--------|-----------|-------|-----------------|
| OB-1.1 | [x] | First launch | 1. Install app fresh 2. Launch | Welcome screen displayed |
| OB-1.2 | [x] | Get Started button | 1. Tap "Get Started" | Navigate to Philosophy screen |
| OB-1.3 | [x] | Disclaimer visible | 1. View welcome screen | Shows "Not affiliated with FranklinCovey" |

### 1.2 Philosophy Screen

| ID | Status | Test Case | Steps | Expected Result |
|----|--------|-----------|-------|-----------------|
| OB-2.1 | [x] | Quadrants displayed | 1. View Philosophy screen | All 4 quadrants shown with descriptions |
| OB-2.2 | [x] | Quadrant II highlighted | 1. View quadrants | Q2 has special border and "FOCUS HERE" badge |
| OB-2.3 | [x] | Back navigation | 1. Tap Back | Return to Welcome screen |
| OB-2.4 | [x] | Continue navigation | 1. Tap Continue | Navigate to Mission setup |

### 1.3 Mission Setup Screen

| ID | Status | Test Case | Steps | Expected Result |
|----|--------|-----------|-------|-----------------|
| OB-3.1 | [x] | Empty mission blocked | 1. Leave field empty 2. Tap Continue | Alert: "Please write your personal mission statement" |
| OB-3.2 | [x] | Valid mission | 1. Enter mission text 2. Tap Continue | Mission saved, navigate to Values |
| OB-3.3 | [x] | Help icon | 1. Tap "?" icon | Navigate to mission wiki page |
| OB-3.4 | [x] | Guiding questions | 1. View screen | 5 guiding questions displayed |
| OB-3.5 | [x] | Long text | 1. Enter 500+ chars 2. Save | Text saved without truncation |

### 1.4 Values Setup Screen

| ID | Status | Test Case | Steps | Expected Result |
|----|--------|-----------|-------|-----------------|
| OB-4.1 | [x] | No values blocked | 1. Don't select any 2. Tap Continue | Alert: "Please select at least one value" |
| OB-4.2 | [x] | Select predefined value | 1. Tap value chip | Value highlighted/selected |
| OB-4.3 | [x] | Multiple values | 1. Select 3+ values 2. Tap Continue | All values saved |
| OB-4.4 | [x] | Custom value | 1. Tap "+ Add Custom Value" 2. Enter name 3. Add | Custom value in list |
| OB-4.5 | [x] | Categories displayed | 1. View screen | Values grouped by category |
| OB-4.6 | [x] | Selected count | 1. Select values | Button shows "Continue (X selected)" |
| OB-4.7 | [x] | Deselect value | 1. Select value 2. Tap again | Value deselected |

### 1.5 Roles Setup Screen

| ID | Status | Test Case | Steps | Expected Result |
|----|--------|-----------|-------|-----------------|
| OB-5.1 | [x] | No roles blocked | 1. Don't add any 2. Tap Continue | Alert: "Please add at least one role" |
| OB-5.2 | [x] | Add suggested role | 1. Tap role from suggestions | Role added to list |
| OB-5.3 | [x] | Max 7 roles | 1. Add 7 roles 2. Try adding 8th | Alert: "You can only have 7 roles" |
| OB-5.4 | [x] | Custom role | 1. Tap "+ Add Custom Role" 2. Enter name 3. Add | Role in list |
| OB-5.5 | [x] | Remove role | 1. Add role 2. Tap X | Role removed |
| OB-5.6 | [x] | Progress bar | 1. Add roles | Progress shows X/7 |

### 1.6 Complete Screen

| ID | Status | Test Case | Steps | Expected Result |
|----|--------|-----------|-------|-----------------|
| OB-6.1 | [x] | Completion message | 1. Reach complete screen | "You're All Set!" displayed |
| OB-6.2 | [x] | Start Planning | 1. Tap "Start Planning" | Navigate to Today tab |
| OB-6.3 | [x] | Onboarding persistence | 1. Complete onboarding 2. Close app 3. Reopen | App opens to Today tab, not onboarding |

---

## 2. Daily Planning (Today Tab)

**Priority: CRITICAL**
**Path**: `app/(tabs)/today.tsx`

### 2.1 Empty State

| ID | Status | Test Case | Steps | Expected Result |
|----|--------|-----------|-------|-----------------|
| TD-1.1 | [x] | Empty state display | 1. Open Today with no tasks | "No Tasks Yet" card shown |
| TD-1.2 | [x] | Add First Task button | 1. View empty state | "Add First Task" button visible |
| TD-1.3 | [x] | Date display | 1. View header | Current date formatted (e.g., "Wednesday, January 28") |

### 2.2 Task Creation

| ID | Status | Test Case | Steps | Expected Result |
|----|--------|-----------|-------|-----------------|
| TD-2.1 | [x] | Open add form | 1. Tap "+ Add Task" | Form appears with fields |
| TD-2.2 | [x] | Empty title blocked | 1. Leave title empty 2. Tap Add | Alert: "Please enter a task title" |
| TD-2.3 | [x] | Create task | 1. Enter title 2. Tap Add | Task appears in list |
| TD-2.4 | [x] | Default priority | 1. Open form | Priority defaults to "B" |
| TD-2.5 | [x] | Default quadrant | 1. Open form | Quadrant defaults to "II" |
| TD-2.6 | [x] | Priority A selection | 1. Select priority A 2. Add task | Task shows A badge (red) |
| TD-2.7 | [x] | Priority B selection | 1. Select priority B 2. Add task | Task shows B badge (orange) |
| TD-2.8 | [x] | Priority C selection | 1. Select priority C 2. Add task | Task shows C badge (yellow) |
| TD-2.9 | [x] | Quadrant I-IV | 1. Select each quadrant | Visual feedback on selection |
| TD-2.10 | [x] | Custom minutes | 1. Enter "45" 2. Add task | Task shows "45m" |
| TD-2.11 | [x] | Default minutes | 1. Leave minutes empty 2. Add | Task shows "30m" (default) |
| TD-2.12 | [x] | Cancel form | 1. Open form 2. Tap Cancel | Form closes, fields reset |
| TD-2.13 | [x] | Help icon (priorities) | 1. Tap "?" near Priority | Navigate to priorities wiki |
| TD-2.14 | [x] | Help icon (quadrants) | 1. Tap "?" near Quadrant | Navigate to quadrants wiki |

### 2.3 Task Management

| ID | Status | Test Case | Steps | Expected Result |
|----|--------|-----------|-------|-----------------|
| TD-3.1 | [x] | Complete task | 1. Tap checkbox | Checkmark appears, title strikethrough |
| TD-3.2 | [x] | Uncomplete task | 1. Tap completed checkbox | Checkmark removed, text normal |
| TD-3.3 | [x] | Delete task | 1. Tap X 2. Confirm | Task removed |
| TD-3.4 | [x] | Cancel delete | 1. Tap X 2. Cancel | Task remains |
| TD-3.5 | [x] | Task sorting | 1. Add tasks A, B, C priority | Sorted A > B > C |
| TD-3.6 | [x] | Completed at bottom | 1. Complete task | Completed tasks sorted last within priority group |

### 2.4 Statistics

| ID | Status | Test Case | Steps | Expected Result |
|----|--------|-----------|-------|-----------------|
| TD-4.1 | [x] | Task count | 1. Add 5 tasks | Stats show "5" Tasks |
| TD-4.2 | [x] | Done count | 1. Complete 3 tasks | Stats show "3" Done |
| TD-4.3 | [x] | Planned minutes | 1. Add tasks (30m+45m+15m) | Stats show "90m" Planned |
| TD-4.4 | [x] | Real-time update | 1. Add/complete/delete | Stats update immediately |

### 2.5 Data Persistence

| ID | Status | Test Case | Steps | Expected Result |
|----|--------|-----------|-------|-----------------|
| TD-5.1 | [x] | Task persistence | 1. Add task 2. Close app 3. Reopen | Task still exists |
| TD-5.2 | [x] | Completion persistence | 1. Complete task 2. Close/reopen | Task still completed |
| TD-5.3 | [ ] | Date-based tasks | 1. Add task today 2. Check tomorrow | Task only on correct date |

---

## 3. Weekly Planning (Week Tab)

**Priority: CRITICAL**
**Path**: `app/(tabs)/week.tsx`

### 3.1 Week Display

| ID | Status | Test Case | Steps | Expected Result |
|----|--------|-----------|-------|-----------------|
| WK-1.1 | [x] | Week range | 1. Open Week tab | Shows "Week of MMM d - MMM d" (no year) |
| WK-1.2 | [x] | Correct week | 1. Check current date | Week range matches ISO week |
| WK-1.3 | [x] | Empty state | 1. No Big Rocks | "No Big Rocks Yet" displayed with help icon |
| WK-1.4 | [x] | Help icon (header) | 1. View header | Help icon links to Weekly Planning wiki |
| WK-1.5 | [x] | Help icon (Big Rocks) | 1. View "Your Big Rocks" section | Help icon links to Big Rocks wiki |

### 3.2 Big Rock Creation

| ID | Status | Test Case | Steps | Expected Result |
|----|--------|-----------|-------|-----------------|
| WK-2.1 | [x] | Open add form | 1. Tap "+ Add Big Rock" | Form appears |
| WK-2.2 | [x] | Empty title blocked | 1. Leave title empty 2. Tap Add | Alert: "Please enter a title" |
| WK-2.3 | [x] | Invalid hours | 1. Enter 0 hours 2. Tap Add | Alert about valid hours |
| WK-2.4 | [x] | Create Big Rock | 1. Enter title, hours 2. Tap Add | Big Rock in list |
| WK-2.5 | [x] | Big Rock display | 1. Add Big Rock | Shows title, hours, checkbox |

### 3.3 Big Rock Management

| ID | Status | Test Case | Steps | Expected Result |
|----|--------|-----------|-------|-----------------|
| WK-3.1 | [x] | Complete Big Rock | 1. Tap checkbox | Checkmark, strikethrough |
| WK-3.2 | [x] | Uncomplete | 1. Tap completed checkbox | Checkmark removed |
| WK-3.3 | [x] | Delete Big Rock | 1. Tap X 2. Confirm | Big Rock removed |
| WK-3.4 | [x] | Always Quadrant II | 1. Add Big Rock 2. Check data | Big Rock has quadrant: "II" |

### 3.4 Calendar Integration

> **Note**: Calendar integration functionality has been removed from the app. These test cases are marked as N/A.

| ID | Status | Test Case | Steps | Expected Result |
|----|--------|-----------|-------|-----------------|
| WK-4.1 | [x] | Add to calendar | N/A - Feature removed | N/A |
| WK-4.2 | [x] | No permission | N/A - Feature removed | N/A |
| WK-4.3 | [x] | Calendar synced icon | N/A - Feature removed | N/A |
| WK-4.4 | [x] | Loading state | N/A - Feature removed | N/A |

### 3.5 Statistics

| ID | Status | Test Case | Steps | Expected Result |
|----|--------|-----------|-------|-----------------|
| WK-5.1 | [x] | Big Rocks count | 1. Add 3 Big Rocks | Stats show "3" |
| WK-5.2 | [x] | Completed count | 1. Complete 2 Big Rocks | Stats show "2" completed |
| WK-5.3 | [x] | Hours estimate | 1. Add (2h + 3h + 1h) | Stats show "6h" |

---

## 4. Matrix Visualization

**Priority: HIGH**
**Path**: `app/(tabs)/matrix.tsx`

### 4.1 Grid Display

| ID | Status | Test Case | Steps | Expected Result |
|----|--------|-----------|-------|-----------------|
| MX-1.1 | [x] | All quadrants visible | 1. Open Matrix tab | 2x2 grid displayed |
| MX-1.2 | [x] | Quadrant II highlight | 1. View matrix | Q2 has thicker border, "Focus Zone" |
| MX-1.3 | [x] | Item counts | 1. Add tasks/Big Rocks | Count shown on each quadrant |
| MX-1.4 | [x] | Time percentages | 1. Complete tasks | Percentage per quadrant |

### 4.2 Quadrant Detail

| ID | Status | Test Case | Steps | Expected Result |
|----|--------|-----------|-------|-----------------|
| MX-2.1 | [x] | Tap quadrant | 1. Tap any quadrant card | Detail view opens |
| MX-2.2 | [x] | Big Rocks section | 1. View detail with Big Rocks | "Big Rocks" list shown |
| MX-2.3 | [x] | Tasks section | 1. View detail with tasks | "Today's Tasks" list shown |
| MX-2.4 | [x] | Empty quadrant | 1. View quadrant with no items | "No items in this quadrant" |
| MX-2.5 | [x] | Close detail | 1. Tap X | Return to grid |
| MX-2.6 | [x] | Task priority badge | 1. View tasks in detail | Priority (A/B/C) visible |

### 4.3 Summary Statistics

| ID | Status | Test Case | Steps | Expected Result |
|----|--------|-----------|-------|-----------------|
| MX-3.1 | [x] | Summary card | 1. Complete task | Summary card appears at bottom |
| MX-3.2 | [x] | Total time | 1. View summary | Total minutes shown |
| MX-3.3 | [x] | Quadrant breakdown | 1. View summary | Q1-Q4 percentages with colors |
| MX-3.4 | [x] | No data | 1. No completed tasks | Summary card hidden |

---

## 5. Goals Management

**Priority: HIGH**
**Path**: `app/(tabs)/goals.tsx`, `app/(modals)/goal/`

### 5.1 Goals Overview

| ID | Status | Test Case | Steps | Expected Result |
|----|--------|-----------|-------|-----------------|
| GL-1.1 | [x] | Empty state | 1. Open Goals with none | "No Goals Yet" displayed |
| GL-1.2 | [x] | Statistics | 1. Have goals | Total, completed, avg progress shown |
| GL-1.3 | [x] | Add goal button | 1. Scroll to bottom | "Add New Goal" button visible |

### 5.2 Goal Creation

| ID | Status | Test Case | Steps | Expected Result |
|----|--------|-----------|-------|-----------------|
| GL-2.1 | [x] | Open new goal | 1. Tap "Create First Goal" | Modal opens |
| GL-2.2 | [x] | Empty title blocked | 1. Leave title empty 2. Create | Alert about title required |
| GL-2.3 | [x] | Default deadline | 1. Open form | Deadline = 1 year from now |
| GL-2.4 | [x] | Change deadline | 1. Tap deadline 2. Select date | New date saved |
| GL-2.5 | [x] | Default quadrant | 1. Open form | Quadrant II selected |
| GL-2.6 | [x] | Link values | 1. Tap value chips | Selection toggles |
| GL-2.7 | [x] | Link roles | 1. Tap role chips | Selection toggles |
| GL-2.8 | [x] | Create goal | 1. Fill form 2. Create | Goal added, modal closes |

### 5.3 Goal Detail

| ID | Status | Test Case | Steps | Expected Result |
|----|--------|-----------|-------|-----------------|
| GL-3.1 | [x] | View goal | 1. Tap goal card | Detail modal opens |
| GL-3.2 | [x] | Info display | 1. View detail | Title, deadline, progress shown |
| GL-3.3 | [x] | Edit goal | 1. Tap Edit | Fields become editable |
| GL-3.4 | [x] | Save edit | 1. Edit 2. Save | Changes persisted |
| GL-3.5 | [x] | Cancel edit | 1. Edit 2. Cancel | Original text restored |
| GL-3.6 | [x] | Delete goal | 1. Tap "Delete Goal" 2. Confirm | Goal removed |

### 5.4 Goal Steps

| ID | Status | Test Case | Steps | Expected Result |
|----|--------|-----------|-------|-----------------|
| GL-4.1 | [x] | No steps initially | 1. View new goal | "No steps yet" message |
| GL-4.2 | [x] | Add step | 1. Tap "+ Add Step" 2. Enter title 3. Add | Step in list |
| GL-4.3 | [x] | Complete step | 1. Tap step checkbox | Checkmark appears |
| GL-4.4 | [x] | Progress update | 1. Complete 2/5 steps | Progress bar shows 40% |
| GL-4.5 | [x] | 100% progress | 1. Complete all steps | Progress bar full |

---

## 6. Profile & Gamification

**Priority: HIGH**
**Path**: `app/(tabs)/profile.tsx`, `app/(modals)/achievements.tsx`

### 6.1 Profile Screen

| ID | Status | Test Case | Steps | Expected Result |
|----|--------|-----------|-------|-----------------|
| PR-1.1 | [x] | Foundation section | 1. Open Profile | Mission, Values, Roles cards visible |
| PR-1.2 | [x] | Mission card | 1. Tap mission | Mission modal opens |
| PR-1.3 | [x] | Values card | 1. Tap values | Values modal opens, count shown |
| PR-1.4 | [x] | Roles card | 1. Tap roles | Roles modal opens, X/7 shown |
| PR-1.5 | [x] | Achievements card | 1. Tap achievements | Achievements modal opens |
| PR-1.6 | [x] | Analytics card | 1. Tap analytics | Analytics modal opens |
| PR-1.7 | [x] | Reflection card | 1. Tap reflection | Reflection modal opens |
| PR-1.8 | [x] | Settings visible | 1. Scroll down | Notifications, Data, Wiki links |

### 6.2 Foundation Modals

| ID | Status | Test Case | Steps | Expected Result |
|----|--------|-----------|-------|-----------------|
| PR-2.1 | [x] | View mission | 1. Open mission modal | Saved mission displayed |
| PR-2.2 | [x] | Edit mission | 1. Edit 2. Save | Mission updated |
| PR-2.3 | [x] | Empty mission blocked | 1. Clear 2. Save | Alert about empty |
| PR-2.4 | [x] | View values | 1. Open values modal | Values by category |
| PR-2.5 | [x] | Add custom value | 1. Tap + 2. Enter name 3. Add | Value added |
| PR-2.6 | [x] | Delete value | 1. Tap X on value | Value removed |
| PR-2.7 | [x] | View roles | 1. Open roles modal | All roles listed |
| PR-2.8 | [x] | Add role | 1. Tap + 2. Enter name 3. Add | Role added |
| PR-2.9 | [x] | Delete role | 1. Tap X on role | Role removed |
| PR-2.10 | [x] | Max 7 roles | 1. Have 7 2. Try adding | Alert about limit |

### 6.3 Achievements

| ID | Status | Test Case | Steps | Expected Result |
|----|--------|-----------|-------|-----------------|
| PR-3.1 | [x] | Progress display | 1. Open achievements | X/Y unlocked with progress bar |
| PR-3.2 | [x] | Streaks display | 1. View card | Week and day streaks shown |
| PR-3.3 | [x] | Unlocked section | 1. Have unlocked | List with trophy icons |
| PR-3.4 | [x] | Locked section | 1. Have locked | List with lock icons, muted |
| PR-3.5 | [x] | Unlock date | 1. View unlocked | "Unlocked [date]" shown |

### 6.4 Achievement Unlocks

| ID | Status | Test Case | Steps | Expected Result |
|----|--------|-----------|-------|-----------------|
| PR-4.1 | [x] | first_mission | 1. Complete mission in onboarding | Achievement unlocked |
| PR-4.2 | [x] | values_defined | 1. Complete values setup | Achievement unlocked |
| PR-4.3 | [x] | roles_complete | 1. Complete roles setup | Achievement unlocked |
| PR-4.4 | [x] | first_goal | 1. Create first goal | Achievement unlocked |
| PR-4.5 | [x] | first_reflection | 1. Complete first reflection | Achievement unlocked |

---

## 7. Analytics & Reflection

**Priority: MEDIUM**
**Path**: `app/(modals)/analytics.tsx`, `app/(modals)/reflection/weekly.tsx`

### 7.1 Analytics

| ID | Status | Test Case | Steps | Expected Result |
|----|--------|-----------|-------|-----------------|
| AN-1.1 | [x] | Empty state | 1. No tracked time | "No Data Yet" message |
| AN-1.2 | [x] | Quadrant II insight | 1. View with data | Insight about Q2 focus |
| AN-1.3 | [x] | Time distribution | 1. Complete tasks | Average percentages shown |
| AN-1.4 | [x] | Q2 focus metric | 1. View metrics | "Weeks with 60%+ Q2" |
| AN-1.5 | [x] | Weeks tracked | 1. View metrics | Number of weeks shown |
| AN-1.6 | [x] | Recent weeks | 1. Have data | Last 8 weeks breakdown |
| AN-1.7 | [x] | Q2 badge | 1. Week with 60%+ Q2 | "Great Q2 Focus!" badge |

### 7.2 Weekly Reflection

| ID | Status | Test Case | Steps | Expected Result |
|----|--------|-----------|-------|-----------------|
| RF-1.1 | [x] | Week range | 1. Open reflection | Current week range shown |
| RF-1.2 | [x] | Questions displayed | 1. View modal | 4 questions (3 required, 1 optional) |
| RF-1.3 | [x] | Empty submission blocked | 1. Leave empty 2. Save | Alert: "Please answer first three questions" |
| RF-1.4 | [x] | Valid submission | 1. Fill Q1-Q3 2. Save | "Reflection Saved" alert |
| RF-1.5 | [x] | Optional Q4 | 1. Skip Q4 2. Submit | Saves successfully |
| RF-1.6 | [x] | Load existing | 1. Complete 2. Reopen | Previous answers loaded |
| RF-1.7 | [x] | Update button | 1. With existing | Button says "Update Reflection" |
| RF-1.8 | [x] | first_reflection achievement | 1. First completion | Achievement unlocked |

---

## 8. Settings & Data Management

**Priority: MEDIUM**
**Path**: `app/(modals)/settings/`

### 8.1 Notification Settings

| ID | Status | Test Case | Steps | Expected Result |
|----|--------|-----------|-------|-----------------|
| ST-1.1 | [x] | Permission required | 1. First access | "Enable Notifications" button |
| ST-1.2 | [x] | Request permission | 1. Tap enable | System dialog appears |
| ST-1.3 | [x] | Permission granted | 1. Grant | Settings toggles appear |
| ST-1.4 | [x] | Weekly planning toggle | 1. Toggle on/off | Setting saved |
| ST-1.5 | [x] | Daily planning toggle | 1. Toggle on/off | Setting saved |
| ST-1.6 | [x] | Weekly reflection toggle | 1. Toggle on/off | Setting saved |

### 8.2 Data Management

| ID | Status | Test Case | Steps | Expected Result |
|----|--------|-----------|-------|-----------------|
| ST-2.1 | [ ] | Data size display | 1. Open Data | Items and KB shown |
| ST-2.2 | [ ] | Export data | 1. Tap "Export All Data" | Share sheet opens |
| ST-2.3 | [ ] | Export success | 1. Complete export | "Export Successful" alert |
| ST-2.4 | [ ] | Import section | 1. Tap "Show Import Options" | Import area expands |
| ST-2.5 | [ ] | Merge data | 1. Paste JSON 2. Tap Merge 3. Confirm | Data merged |
| ST-2.6 | [ ] | Replace data | 1. Paste JSON 2. Tap Replace 3. Confirm | Data replaced |
| ST-2.7 | [ ] | Invalid JSON | 1. Paste invalid 2. Import | "Import Failed" alert |
| ST-2.8 | [ ] | Clear all data | 1. Tap "Clear All Data" 2. Confirm | Data cleared, back to onboarding |
| ST-2.9 | [ ] | Cancel clear | 1. Tap Clear 2. Cancel | Data intact |

---

## 9. Wiki / Help System

**Priority: LOW**
**Path**: `app/(modals)/wiki/`

### 9.1 Wiki Navigation

| ID | Status | Test Case | Steps | Expected Result |
|----|--------|-----------|-------|-----------------|
| WI-1.1 | [ ] | Access from help icon | 1. Tap any "?" icon | Wiki page opens |
| WI-1.2 | [ ] | Wiki index | 1. Open wiki from Profile | List of all concepts |
| WI-1.3 | [ ] | Back navigation | 1. In wiki 2. Tap Back | Return to previous |
| WI-1.4 | [ ] | Close navigation | 1. In wiki 2. Tap Close | Return to app |
| WI-1.5 | [ ] | Safe area respected | 1. Open wiki | No overlap with status bar |

### 9.2 Wiki Content

| ID | Status | Test Case | Steps | Expected Result |
|----|--------|-----------|-------|-----------------|
| WI-2.1 | [ ] | Quadrants page | 1. Access quadrants | Content about 4 quadrants |
| WI-2.2 | [ ] | Priorities page | 1. Access priorities | A-B-C system explained |
| WI-2.3 | [ ] | Big Rocks page | 1. Access big-rocks | Big rocks methodology |
| WI-2.4 | [ ] | Daily planning page | 1. Access daily-planning | Daily planning process |
| WI-2.5 | [ ] | Mission page | 1. Access mission | Mission guidance |
| WI-2.6 | [ ] | Related concepts | 1. View any page | Related concepts shown |

---

## 10. Edge Cases & Error Handling

**Priority: HIGH**

### 10.1 Data Validation

| ID | Status | Test Case | Steps | Expected Result |
|----|--------|-----------|-------|-----------------|
| ED-1.1 | [ ] | Whitespace only | 1. Enter "   " 2. Submit | Treated as empty |
| ED-1.2 | [ ] | Very long text | 1. Enter 5000+ chars 2. Save | Saved without crash |
| ED-1.3 | [ ] | Special characters | 1. Enter emoji, unicode 2. Save | Preserved correctly |
| ED-1.4 | [ ] | Negative numbers | 1. Enter "-5" for hours | Rejected or converted |

### 10.2 Navigation

| ID | Status | Test Case | Steps | Expected Result |
|----|--------|-----------|-------|-----------------|
| ED-2.1 | [ ] | Deep back navigation | 1. Navigate deep 2. Go back multiple | Correct hierarchy |
| ED-2.2 | [ ] | Modal stacking | 1. Open modal > tap link > new modal | Can close in order |
| ED-2.3 | [ ] | Tab switching | 1. Switch tabs rapidly | Correct data shown |

### 10.3 Persistence

| ID | Status | Test Case | Steps | Expected Result |
|----|--------|-----------|-------|-----------------|
| ED-3.1 | [ ] | App restart | 1. Add data 2. Force close 3. Reopen | Data persisted |
| ED-3.2 | [ ] | Partial save | 1. Close during operation | Recovers cleanly |

### 10.4 Time/Date

| ID | Status | Test Case | Steps | Expected Result |
|----|--------|-----------|-------|-----------------|
| ED-4.1 | [ ] | Week boundaries | 1. Task on Sunday | Correct week assignment |
| ED-4.2 | [ ] | Year rollover | 1. Task Dec 31 / Jan 1 | Correct year tracking |

---

## Test Execution Notes

### Priority Order
1. **CRITICAL**: Onboarding, Today Tab, Week Tab
2. **HIGH**: Matrix, Goals, Profile, Edge Cases
3. **MEDIUM**: Analytics, Reflection, Settings
4. **LOW**: Wiki

### Devices to Test
- iOS (iPhone 12+)
- Android (10+)

### Test Data Cleanup
Before each full test run:
1. Clear app data or reinstall
2. Start fresh onboarding

---

## Bug Report Template

```
## Bug ID: [AUTO]
## Severity: Critical/High/Medium/Low
## Test Case: [ID]

### Description
[Brief description]

### Steps to Reproduce
1.
2.
3.

### Expected Result
[What should happen]

### Actual Result
[What actually happened]

### Screenshots/Video
[Attach if applicable]

### Device Info
- Platform: iOS/Android
- Version:
- Device:
```

---

## Change Log

| Date | Version | Changes |
|------|---------|---------|
| 2026-01-28 | 1.0 | Initial test cases document |
