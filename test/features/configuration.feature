Feature: Configuration

  @mobile @tablet @desktop
  Scenario: I use the default config file
    Given I go to the "index" page
    Then the logo should use "images/logo.png" as src
    And the theme should be "light"
    And the page title should be "JW Showcase"
    And the description should be:
    """
    JW Showcase is an open-source, dynamically generated video website built around JW Player and JW Platform services. It enables you to easily publish your JW Player-hosted video content with no coding and minimal configuration.
    """
    And the footer text should be "Powered by JW Player"

  @mobile @tablet @desktop
  Scenario: I use a custom config file
    Given I set the configLocation to "./fixtures/config/custom.json"
    And I go to the "index" page
    Then the logo should use "/fixtures/jwplayer-logo.png" as src
    And the theme should be "dark"
    And the page title should be "Custom siteName"
    And the description should be:
    """
    Custom description
    """
    And the footer text should be "Custom footer"

  @mobile @tablet @desktop
  Scenario: I use an invalid config file
    Given I set the configLocation to "./fixtures/config/invalid.json"
    And I go to the "index" page
    Then the error page is shown
    And the error page displays the following message "Failed to load config file"

  @mobile @tablet @desktop
  Scenario: I use an non existing config file
    Given I set the configLocation to "./fixtures/config/notthere.json"
    And I go to the "index" page
    Then the error page is shown
    And the error page displays the following message "Failed to load config file"

  @mobile @tablet @desktop
  Scenario: I don't want to use the featured slider
    Given I set the configLocation to "./fixtures/config/noFeaturedPlaylist.json"
    And I go to the "index" page
    Then the featured slider should not be visible

  @mobile @tablet @desktop
  Scenario: I don't want to use the default sliders
    Given I set the configLocation to "./fixtures/config/noPlaylists.json"
    And I go to the "index" page
    Then the default sliders should not be visible


  @mobile @tablet @desktop
  Scenario: I don't want to use the right siderail
      Given I set the configLocation to "./fixtures/config/noSiderail.json"
      And I go to the "/m/Iyfst4Se/?list=lrYLc95e" page
      Then the siderail should not be visible

  @mobile @tablet @desktop
  Scenario: I want to use the right siderail
      Given I set the configLocation to "./fixtures/config/siderail.json"
      And I go to the "/m/Iyfst4Se/?list=lrYLc95e" page
      Then the siderail should be visible
