Feature: Watch progress
  After watching a video the video should be added to the "Continue watching" slider
  It should be removed after being watched over 95% of the video duration
  It should be removed after not watching the video for 30 days
  It should show a progress bar in each card in the "Continue watching" slider
  It should sort items DESC based on lastWatched timestamp
  It should continue playing the video at the last saved position

  @desktop @tablet @mobile
  Scenario: Save video watch progress while playing video
    Given the browser has localStorage support
    And I go to the "/list/lrYLc95e/video/Iyfst4Se/" page
    When I wait until the video is loaded
    And I start video playback
    And I wait until the video is playing
    And I seek to 50 seconds in the video
    Then the video progress of mediaid "Iyfst4Se" and feedid "lrYLc95e" should be saved

  @desktop @tablet @mobile
  Scenario: Remove video watch progress after 95% watch time
    Given the browser has localStorage support
    And localStorage key "jwshowcase.watchprogress" has the following data:
    """
    [{"mediaid": "Iyfst4Se", "feedid": "lrYLc95e", "progress": 0.75, "lastWatched": 9999999999999}]
    """
    And I go to the "/list/lrYLc95e/video/Iyfst4Se/" page
    When I wait until the video is loaded
    And I start video playback
    And I wait until the video is playing
    And I seek to the end of video
    Then the video progress of mediaid "Iyfst4Se" and feedid "lrYLc95e" should not be saved

  @desktop @tablet @mobile
  Scenario: Show the "Continue watching" slider in the dashboard page
    Given the browser has localStorage support
    And localStorage key "jwshowcase.watchprogress" has the following data:
    """
    [{"mediaid": "LjBvF1FX", "feedid": "lrYLc95e", "progress": 0.75, "lastWatched": 9999999999999},{"mediaid": "Iyfst4Se", "feedid": "lrYLc95e", "progress": 0.5, "lastWatched": 8888888888888}]
    """
    And I go to the "index" page
    When I scroll to the continue watching slider
    Then the continue watching slider should be visible
    And the continue watching slider should contain 2 items
    And the 1st card in the continue watching slider should have mediaid "LjBvF1FX"
    And the 1st card in the continue watching slider should show 75% watch progress
    And the 2nd card in the continue watching slider should have mediaid "Iyfst4Se"
    And the 2nd card in the continue watching slider should show 50% watch progress

  @desktop @tablet @mobile
  Scenario: Show the "Continue watching" slider in the dashboard page without the invalid items
    Given the browser has localStorage support
    And localStorage key "jwshowcase.watchprogress" has the following data:
    """
    [{"mediaid": "LjBvF1FX", "feedid": "lrYLc95e", "progress": 0.75, "lastWatched": 1465224056293},
    {"mediaid": "Iyfst4Se", "feedid": "lrYLc95e", "progress": 0.5, "lastWatched": 9999999999999},
    {"mediaid": "uNXCVIsW", "feedid": "lrYLc95e", "progress": 1, "lastWatched": 8888888888888},
    {"mediaid": "FV4n0UaB", "feedid": "lrYLc95e", "progress": 0.65, "lastWatched": 8888888888888}]
    """
    And I go to the "index" page
    Then the continue watching slider should be visible
    And the continue watching slider should contain 2 items
    And the 1st card in the continue watching slider should have mediaid "Iyfst4Se"
    And the 1st card in the continue watching slider should show 50% watch progress
    And the 2nd card in the continue watching slider should have mediaid "FV4n0UaB"
    And the 2nd card in the continue watching slider should show 65% watch progress

  @desktop @tablet @mobile
  Scenario: Start video at last known position
    Given the browser has localStorage support
    And localStorage key "jwshowcase.watchprogress" has the following data:
    """
    [{"mediaid": "LjBvF1FX", "feedid": "lrYLc95e", "progress": 0.5, "lastWatched": 9999999999999}]
    """
    And I go to the "/list/lrYLc95e/video/LjBvF1FX/" page
    When I wait until the video is loaded
    And I start video playback
    And I wait until the video is playing
    And wait for 1 seconds
    Then the video progress should be greater than 50%
