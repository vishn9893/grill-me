# Forum Build - Grill Me

## Goal
Build a new forum similar to https://news.ycombinator.com/ (Hacker News) from scratch.

## Questions

1. **What is the primary purpose of this forum?** (e.g., news aggregation, discussion board, product review, etc.)
2. **Who is the target audience?** (e.g., developers, tech enthusiasts, general public, specific community)
3. **What are the key features you want to include?** (e.g., upvoting/downvoting, commenting, categories, search, user profiles, moderation tools)
4. **What is your timeline and deadline?** (e.g., MVP in 2 weeks, full feature set in 3 months)
5. **What are your technical constraints?** (e.g., preferred stack, hosting, budget, team size)

## Completed Answers

1. **Primary Purpose:** News aggregation
2. **Target Audience:** Developers
3. **Key Features:** Upvoting/downvoting, commenting, categories, search, user profiles
4. **Timeline/Deadline:** MVP in 1 week
5. **Technical Constraints:** PostgreSQL, fast frontend, AWS hosting

## To-Do List (MVP - 1 Week)

### Day 1: Project Setup & Database
- [ ] Initialize project repository (Git)
- [ ] Set up PostgreSQL database (tables: posts, users, comments, categories)
- [ ] Configure AWS hosting environment (EC2 or RDS)

### Day 2: Core Backend
- [ ] Implement API endpoints for:
  - Create/Read posts (with upvote/downvote support)
  - Get top posts (sorted by score)
  - Add comments to posts
  - User authentication (basic login/register)
- [ ] Set up database migrations

### Day 3: Frontend MVP
- [ ] Create static frontend (React/Vue) with:
  - Home page showing top posts
  - Post detail page with comments
  - Upvote/downvote buttons
  - Simple category filtering
- [ ] Connect frontend to backend API

### Day 4: Polish & Testing
- [ ] Add search functionality
- [ ] Implement user profiles
- [ ] Basic error handling and validation
- [ ] Deploy to AWS

### Day 5: Final Review
- [ ] Test all features
- [ ] Verify MVP requirements met
- [ ] Document setup instructions

## Next Steps
1. Create the project structure
2. Set up the database schema
3. Begin implementing the backend API
