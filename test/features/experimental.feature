Feature: Experimental

  @mobile @tablet @desktop
  Scenario: I want to set custom footer links
    Given I set the configLocation to "./fixtures/config/experimental.json"
    Given I go to the "index" page
    Then the footer should contain 3 links
    And the "text" for the 1st link should be "Privacy Policy"
    And the "url" for the 1st link should be "https://www.jwplayer.com/privacy/"
    And the "text" for the 2nd link should be "Ad Choices"
    And the "url" for the 2nd link should be "https://www.jwplayer.com/privacy/#ad-choices"
    And the "text" for the 3rd link should be "DMCA"
    And the "url" for the 3rd link should be "https://www.jwplayer.com/dmca/"

  @mobile @tablet @desktop
  Scenario: I want to see a copyright text in the footer
    Given I set the configLocation to "./fixtures/config/experimental.json"
    And I am still on the "index" page
    Then the footer should contain the copyright text

  @mobile @tablet @desktop
    Scenario: I want the related overlay to show after the video ends
    Given I set the configLocation to "./fixtures/config/experimental.json"
    And I go to the "/m/Iyfst4Se/spotlight?list=lrYLc95e" page
    When I wait until the video is loaded
    And I start video playback
    And wait for 1 seconds
    And I seek to the end of video
    And I wait for the video to end
    Then the related overlay is shown
