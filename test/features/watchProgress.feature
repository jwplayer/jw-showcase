Feature: Watch progress
  After watching a video the video should be added to the "Continue watching" slider
  It should be removed after being watched over 95% of the video duration
  It should be removed after not watching the video for 30 days
  It should show a progress bar in each card in the "Continue watching" slider
  It should sort items DESC based on lastWatched timestamp
  It should continue playing the video at the last saved position

  @desktop @tablet @mobile
  Scenario: Save video watch progress while playing video
    Given I go to the "/list/lrYLc95e/video/Iyfst4Se/" page
    And I wait until the page has been loaded
    When I start video playback
    And I wait until the video starts playing
    And I seek to 30 seconds
    Then the video progress of mediaid "Iyfst4Se" and feedid "lrYLc95e" should be saved

  @desktop @tablet @mobile
  Scenario: Remove video watch progress after 95% watch time
    Given I have the following saved watch progress:
      | mediaid  | feedid   | progress | lastWatched | offset |
      | Iyfst4Se | lrYLc95e | 0.75     | now         | 0      |
    And I go to the "/list/lrYLc95e/video/Iyfst4Se/" page
    And I wait until the page has been loaded
    When I start video playback
    And I seek to the end of video
    And wait for 2 seconds
    Then the video progress of mediaid "Iyfst4Se" and feedid "lrYLc95e" should not be saved

  @desktop @tablet @mobile
  Scenario: Show the "Continue watching" slider in the dashboard page
    Given I have the following saved watch progress:
      | mediaid  | feedid   | progress | lastWatched | offset |
      | LjBvF1FX | lrYLc95e | 0.75     | now         | -10    |
      | Iyfst4Se | lrYLc95e | 0.5      | now         | 0      |
    And I go to the "index" page
    When I wait until the page has been loaded
    Then the "Continue watching" slider should be visible
    And the "Continue watching" slider should contain 2 cards
    And the first card in "Continue watching" slider should have mediaid "Iyfst4Se"
    And the first card in "Continue watching" slider should show "50%" watch progress

  @desktop @tablet @mobile
  Scenario: Show the "Continue watching" slider in the dashboard page without the invalid items
    Given I have the following saved watch progress:
      | mediaid  | feedid   | progress | lastWatched   | offset |
      | LjBvF1FX | lrYLc95e | 0.75     | now           | -10    |
      | Iyfst4Se | lrYLc95e | 0.5      | now           | 0      |
      | uNXCVIsW | lrYLc95e | 1        | now           | 0      |
      | FV4n0UaB | lrYLc95e | 0.5      | 1465224056293 | 0      |
    And I go to the "index" page
    When I wait until the page has been loaded
    Then the "Continue watching" slider should be visible
    And the "Continue watching" slider should contain 2 cards

  @desktop @tablet @mobile
  Scenario: Not show video watch progress of 31 days old in "Continue watching" slider
    Given I have a saved watchProgress of 31 days old with mediaid "Iyfst4Se" and feedid "lrYLc95e"
    And I go to the "index" page
    When I wait until the page has been loaded
    Then the "Continue watching" slider should not be visible

  @desktop @tablet @mobile
  Scenario: Start video at last known position
    Given I have the following saved watch progress:
      | mediaid  | feedid   | progress | lastWatched   | offset |
      | LjBvF1FX | lrYLc95e | 0.5      | now           | -10    |
    And I go to the "/list/lrYLc95e/video/LjBvF1FX/" page
    When I wait until the page has been loaded
    And I start video playback
    And I wait until the video starts playing
    And wait for 2 seconds
    And the video progress should be greater than 50%
