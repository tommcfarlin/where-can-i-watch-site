# Streaming Display Options Backlog

## Current Implementation
**Option B: Streaming-Only Results** ✅ *Implemented*
- Only show content confirmed available for streaming in the US
- Hide non-streamable movies entirely from search results
- Clean, focused user experience showing only actionable content

## Alternative Options for Investigation

### Option A: Show All with Indicators
**Status:** *Backlog - User Research Needed*
- Show all US-relevant content
- Clearly indicate when content is not streaming ("Not available for streaming in the US")
- Allows content discovery even for non-streamable titles
- **Use Case:** Users want to know what exists, even if not currently streamable

### Option C: Filtered Categories
**Status:** *Backlog - UX Design Needed*
- Default to streaming-only results
- Add toggle/filter to "Include non-streaming content"
- Best of both worlds approach
- **Implementation:** Add toggle in search interface

### Option D: Contextual Display
**Status:** *Backlog - Complex Implementation*
- Show streaming content prominently
- Show non-streaming content in separate "Also Available" section
- Different visual treatment for each category
- **Use Case:** Comprehensive discovery with clear hierarchy

### Option E: Progressive Disclosure
**Status:** *Backlog - Research Required*
- Show streaming-only by default
- "Show X more results (not currently streaming)" button at bottom
- Maintains focused experience with discovery option
- **Benefit:** User controls information density

## Decision Factors to Research

1. **User Intent Analysis**
   - Are users primarily looking for immediate viewing options?
   - Do users value comprehensive content discovery?

2. **Conversion Metrics**
   - Does showing non-streamable content reduce engagement?
   - Do users prefer focused vs. comprehensive results?

3. **Mobile vs. Desktop Behavior**
   - Different patterns on different devices?

4. **Competitive Analysis**
   - How do other streaming search tools handle this?

## Implementation Notes

- Current filtering logic in `app/components/SearchResults.tsx` line 193
- Uses `isStreamable()` from `lib/streaming-detection.ts`
- Provider data fetched via `app/api/providers/batch/route.ts`
- Easy to toggle between options by changing `allResults` array composition

## Next Steps

1. Monitor user feedback on Option B implementation
2. A/B test different approaches if needed
3. Consider seasonal/contextual variations (e.g., holiday movie discovery)