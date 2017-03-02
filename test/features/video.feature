Feature: Video page

  @tablet @desktop @mobile
  Scenario: As a user I want to see a video not found page when the video doesn't exist
    Given I go directly to the "/list/lrYLc95e/video/johndoe" page
    When I wait until the page has been loaded
    Then the video not found page should be visible

  @tablet @desktop @mobile
  Scenario: As a user I want to watch a video
    Given I go to the "/list/lrYLc95e/video/Iyfst4Se/" page
    When I wait until the page has been loaded
    Then the video player is ready

  @mobile @tablet @desktop
   Scenario: As a user I want to see the play icon
    Given I am still on the "/list/lrYLc95e/video/Iyfst4Se/" page
    When I do nothing
    Then the play icon should be visible

  @mobile @tablet @desktop
  Scenario: As a user I want to see the video duration
    Given I am still on the "/list/lrYLc95e/video/Iyfst4Se/" page
    When I do nothing
    Then the video details should show the duration

  @mobile @tablet @desktop
  Scenario: As a user I want to see the video title and description below the video
    Given I am still on the "/list/lrYLc95e/video/Iyfst4Se/" page
    When I wait until the page has been loaded
    Then the video title and description should be visible

  @mobile @tablet @desktop
  Scenario: As a user I want to see the More like this title
    Given I am still on the "/list/lrYLc95e/video/Iyfst4Se/" page
    When I wait until the page has been loaded
    And I scroll to the related slider
    Then the related videos title is shown

  @mobile @tablet @desktop
  Scenario: As a user I want to be able to navigate back to the dashboard by clicking the back button
    Given I am still on the "/list/lrYLc95e/video/Iyfst4Se/" page
    When I wait until the page has been loaded
    And I click on the back button in the toolbar
    Then I should navigate to the "index" page

  @desktop @mobile @tablet
  Scenario: As a user I want to be able to start video playback
    Given I go to the "/list/lrYLc95e/video/Iyfst4Se/" page
    When I wait until the page has been loaded
    And wait for 1 seconds
    And I start video playback
    Then the video should be playing

  @desktop @mobile @tablet
  Scenario: As a user I want to see the right title and metadata
    Given I go to the "/list/lrYLc95e/video/Iyfst4Se/" page
    When I wait until the page has been loaded
    Then the title should be "Spotlight - JW Showcase"
    And the description should be "Starring Michael Keaton, Mark Ruffalo, Rachel McAdams, Liev Schreiber, Brian d’Arcy James and Stanley Tucci, Spotlight tells the riveting true story of the Pulitzer Prize-winning Boston Globe investigation that would rock the city and cause a crisis in one of the world’s oldest and most trusted institutions."
    And the canonical path should be "/list/lrYLc95e/video/Iyfst4Se/spotlight"

  @desktop @tablet
  Scenario: As a user I want to see the right title and metadata after I click on the next item
    Given I am still on the "/list/lrYLc95e/video/Iyfst4Se/" page
    When I wait until the page has been loaded
    And I scroll to the more like this slider
    And I click on the 2nd visible card in the more like this slider
    And wait for 1 seconds
    Then the title should be "The Girl in the Book - JW Showcase"
    And the description should be "Set in the world of NYC publishing, a young book editor is forced to confront a troubling part of her past when a bestselling author re-enters her life."
    And the canonical path should be "/list/lrYLc95e/video/LjBvF1FX/the-girl-in-the-book"

  @desktop @tablet
  Scenario: As a user I want to see the right title and metadata after the player starts playing the next item from the playlist
    Given I am still on the "/list/lrYLc95e/video/LjBvF1FX/" page
    When I wait until the page has been loaded
    And wait for 1 seconds
    And I start playing the next playlist item
    Then the title should be "Touched with Fire - JW Showcase"
    And the description should be "Touched With Fire stars Katie Homes and Luke Kirby as two poets with bipolar disorder whose art is fueled by their emotional extremes. When they meet in a treatment facility, their chemistry is instant and intense driving each other's mania to new heights. They pursue their passion which breaks outside the bounds of sanity, swinging them from fantastical highs to tormented lows until they ultimately must choose between sanity and love."
    And the canonical path should be "/list/lrYLc95e/video/uNXCVIsW/touched-with-fire"