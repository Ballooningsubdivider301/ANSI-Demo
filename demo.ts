#!/usr/bin/env

import { Colors, Cursor, Input, Mouse, Terminal } from '@neabyte/deno-ansi'

/**
 * Interactive ANSI Terminal Demo Application
 *
 * This demo showcases the capabilities of the Deno ANSI library including:
 * - Terminal colors and text styling
 * - Cursor movement and positioning
 * - Terminal control (clearing, sizing, buffers)
 * - Keyboard input handling with escape sequences
 * - Mouse tracking and event parsing
 *
 * The demo works around a known issue in the Colors class where static properties
 * reference 'this' during initialization, causing undefined errors.
 */
class ANSIDemo {
  // Flag to control the main application loop
  private running = true
  // Index of currently selected menu item (0-based)
  private currentDemo = 0
  // Array of available demo names that correspond to menu items
  private demos = ['colors', 'cursor', 'terminal', 'input', 'mouse', 'exit']

  /**
   * Main application entry point
   * Initializes the terminal, displays welcome message, and runs the main loop
   */
  async run() {
    // Clear the terminal screen and set window title
    await Terminal.clearScreen()
    await Terminal.setWindowTitle('Deno ANSI Demo')
    // Display welcome message with styling
    console.log(Colors.bold('🎨 Deno ANSI Library Demo'))
    console.log(Colors.dim('Press arrow keys to navigate, Enter to select, q to quit\n'))
    // Main application loop - continues until user exits
    while (this.running) {
      await this.showMenu() // Display the interactive menu
      await this.handleInput() // Wait for and process user input
    }
    // Clean up terminal state when exiting
    await this.cleanup()
  }

  /**
   * Displays the interactive menu with navigation
   * Shows all available demo options with visual selection indicator
   */
  private async showMenu() {
    // Clear screen and move cursor to top-left corner
    await Terminal.clearScreen()
    await Cursor.home()
    // Display header with instructions
    console.log(Colors.bold('🎨 Deno ANSI Library Demo'))
    console.log(Colors.dim('Press arrow keys to navigate, Enter to select, q to quit\n'))
    // Define menu items - these correspond to the demos array
    const menuItems = [
      'Color Demo - Show all color capabilities',
      'Cursor Demo - Demonstrate cursor movement',
      'Terminal Demo - Screen control and sizing',
      'Input Demo - Keyboard input handling',
      'Mouse Demo - Mouse tracking and events',
      'Exit Demo'
    ]
    // Render each menu item with appropriate styling
    for (let i = 0; i < menuItems.length; i++) {
      const item = menuItems[i]
      const isSelected = i === this.currentDemo
      if (isSelected) {
        // Selected item: cyan arrow + cyan text
        console.log(Colors.cyan('► ') + Colors.cyan(item))
      } else {
        // Unselected item: spaces + white text
        console.log('  ' + Colors.white(item))
      }
    }
    // Show current selection at bottom
    console.log(
      '\n' + Colors.dim('Current selection: ') + Colors.yellow(this.demos[this.currentDemo])
    )
  }

  /**
   * Handles keyboard input for menu navigation
   * Enables raw mode to capture individual key presses including arrow keys
   */
  private async handleInput() {
    // Enable raw mode to capture individual key presses (not line buffered)
    await Input.enableRawMode()
    try {
      // Wait for a single key press
      const key = await Input.readKey()
      // Process the key based on its value
      switch (key) {
        case 'UP': // Arrow up key
        case 'k': // Vim-style up navigation
          // Move selection up, but don't go below 0
          this.currentDemo = Math.max(0, this.currentDemo - 1)
          break
        case 'DOWN': // Arrow down key
        case 'j': // Vim-style down navigation
          // Move selection down, but don't exceed menu length
          this.currentDemo = Math.min(this.demos.length - 1, this.currentDemo + 1)
          break
        case '\r': // Carriage return (Enter on Windows)
        case '\n': // Line feed (Enter on Unix/Mac)
          // Execute the currently selected demo
          await this.runSelectedDemo()
          break
        case 'q': // Quit command
        case 'Q':
          // Set running flag to false to exit main loop
          this.running = false
          break
      }
    } catch (error) {
      // Handle any input errors gracefully
      console.error('Input error:', error)
    } finally {
      // Always disable raw mode to restore normal terminal behavior
      await Input.disableRawMode()
    }
  }

  /**
   * Executes the currently selected demo based on menu selection
   * Routes to the appropriate demo method based on the currentDemo index
   */
  private async runSelectedDemo() {
    // Get the demo name from the demos array using current selection index
    const demo = this.demos[this.currentDemo]
    // Route to the appropriate demo method
    switch (demo) {
      case 'colors':
        await this.colorDemo() // Show color capabilities
        break
      case 'cursor':
        await this.cursorDemo() // Demonstrate cursor movement
        break
      case 'terminal':
        await this.terminalDemo() // Show terminal control features
        break
      case 'input':
        await this.inputDemo() // Demonstrate input handling
        break
      case 'mouse':
        await this.mouseDemo() // Show mouse tracking
        break
      case 'exit':
        this.running = false // Exit the application
        break
    }
  }

  /**
   * Demonstrates ANSI color capabilities including basic colors, text styles,
   * 256-color palette, and RGB color support
   */
  private async colorDemo() {
    // Clear screen and position cursor at top
    await Terminal.clearScreen()
    await Cursor.home()
    // Display demo header
    console.log(Colors.bold('🌈 Color Capabilities Demo\n'))
    // Show the 8 basic ANSI colors with visual blocks
    console.log(Colors.bold('Basic Colors:'))
    console.log(`  Black    : ${Colors.black('████████')}`) // ANSI color 30
    console.log(`  Red      : ${Colors.red('████████')}`) // ANSI color 31
    console.log(`  Green    : ${Colors.green('████████')}`) // ANSI color 32
    console.log(`  Yellow   : ${Colors.yellow('████████')}`) // ANSI color 33
    console.log(`  Blue     : ${Colors.blue('████████')}`) // ANSI color 34
    console.log(`  Magenta  : ${Colors.magenta('████████')}`) // ANSI color 35
    console.log(`  Cyan     : ${Colors.cyan('████████')}`) // ANSI color 36
    console.log(`  White    : ${Colors.white('████████')}`) // ANSI color 37
    // Demonstrate various text styling options
    console.log('\n' + Colors.bold('Text Styles:'))
    console.log(`  ${Colors.bold('Bold Text')}`) // Bold/bright text
    console.log(`  ${Colors.dim('Dim Text')}`) // Dimmed/faint text
    console.log(`  ${Colors.italic('Italic Text')}`) // Italic text
    console.log(`  ${Colors.underline('Underlined Text')}`) // Underlined text
    console.log(`  ${Colors.strikethrough('Strikethrough Text')}`) // Crossed out text
    console.log(`  ${Colors.blink('Blinking Text')}`) // Blinking text
    console.log(`  ${Colors.inverse('Inverse Text')}`) // Reverse foreground/background
    // Show first 16 colors from the 256-color palette
    console.log('\n' + Colors.bold('256-Color Palette:'))
    for (let i = 0; i < 16; i++) {
      const color = Colors.color256('█', i) // Use color index 0-15
      process.stdout.write(color + ' ') // Write without newline
    }
    console.log('\n') // Add newline after the color blocks
    // Demonstrate RGB color support with specific RGB values
    console.log('\n' + Colors.bold('RGB Colors:'))
    console.log(`  Red      : ${Colors.rgb('████████', 255, 0, 0)}`) // Pure red
    console.log(`  Green    : ${Colors.rgb('████████', 0, 255, 0)}`) // Pure green
    console.log(`  Blue     : ${Colors.rgb('████████', 0, 0, 255)}`) // Pure blue
    console.log(`  Purple   : ${Colors.rgb('████████', 128, 0, 128)}`) // Purple mix
    console.log(`  Orange   : ${Colors.rgb('████████', 255, 165, 0)}`) // Orange mix
    // Wait for user input before returning to menu
    console.log('\n' + Colors.dim('Press any key to return to menu...'))
    await Input.waitForAnyKey()
  }

  /**
   * Demonstrates cursor movement and visibility control
   * Shows how to position the cursor at specific coordinates and toggle visibility
   */
  private async cursorDemo() {
    // Clear screen and position cursor at top
    await Terminal.clearScreen()
    await Cursor.home()
    // Display demo header and instructions
    console.log(Colors.bold('📍 Cursor Movement Demo\n'))
    console.log(Colors.dim('Watch the cursor move around the screen...\n'))
    // Define positions to move the cursor to with labels
    const positions = [
      { x: 10, y: 5, text: 'Position 1' }, // Top-left area
      { x: 30, y: 8, text: 'Position 2' }, // Middle area
      { x: 50, y: 12, text: 'Position 3' }, // Right side
      { x: 20, y: 15, text: 'Position 4' }, // Lower middle
      { x: 40, y: 18, text: 'Position 5' } // Bottom area
    ]
    // Move cursor to each position and display text
    for (const pos of positions) {
      await Cursor.moveTo(pos.x, pos.y) // Move cursor to specific coordinates
      console.log(Colors.green(pos.text)) // Display text at cursor position
      await new Promise(resolve => setTimeout(resolve, 1000)) // Wait 1 second
    }
    // Demonstrate cursor visibility control
    await Cursor.moveTo(10, 20) // Move to bottom area
    console.log(Colors.yellow('Hiding cursor...'))
    await Cursor.setCursorVisible(false) // Hide the cursor
    await new Promise(resolve => setTimeout(resolve, 2000)) // Wait 2 seconds
    // Move cursor to bottom area and show cursor
    await Cursor.moveTo(10, 21) // Move down one line
    console.log(Colors.yellow('Showing cursor...'))
    await Cursor.setCursorVisible(true) // Show the cursor again
    await new Promise(resolve => setTimeout(resolve, 1000)) // Wait 1 second
    // Wait for user input before returning to menu
    console.log('\n' + Colors.dim('Press any key to return to menu...'))
    await Input.waitForAnyKey()
  }

  /**
   * Demonstrates terminal control features including screen clearing,
   * window title management, terminal sizing, and alternate buffer switching
   */
  private async terminalDemo() {
    // Clear screen and position cursor at top
    await Terminal.clearScreen()
    await Cursor.home()
    // Display demo header
    console.log(Colors.bold('🖥️  Terminal Control Demo\n'))
    // Get and display current terminal dimensions
    const size = await Terminal.getSize()
    console.log(`Terminal size: ${Colors.green(size.width + 'x' + size.height)}`)
    // Demonstrate screen filling and clearing
    console.log('\n' + Colors.yellow('Filling screen with text...'))
    for (let i = 0; i < 20; i++) {
      console.log(`Line ${i + 1}: This is some sample text to fill the screen`)
    }
    // Wait 2 seconds to let user see the filled screen
    await new Promise(resolve => setTimeout(resolve, 2000))
    // Clear the screen and show confirmation
    console.log('\n' + Colors.yellow('Clearing screen...'))
    await Terminal.clearScreen()
    await Cursor.home()
    console.log(Colors.green('Screen cleared!'))
    // Demonstrate window title changes
    console.log('\n' + Colors.yellow('Setting window title...'))
    await Terminal.setWindowTitle('ANSI Demo - Terminal Control')
    console.log(Colors.green('Window title updated!'))
    // Demonstrate alternate buffer (useful for full-screen applications)
    console.log('\n' + Colors.yellow('Enabling alternate buffer...'))
    await Terminal.enableAltBuffer() // Switch to alternate buffer
    console.log(Colors.green('Now in alternate buffer!'))
    await new Promise(resolve => setTimeout(resolve, 2000)) // Wait 2 seconds
    // Switch back to main buffer
    console.log('\n' + Colors.yellow('Disabling alternate buffer...'))
    await Terminal.disableAltBuffer() // Switch back to main buffer
    console.log(Colors.green('Back to main buffer!'))
    // Wait for user input before returning to menu
    console.log('\n' + Colors.dim('Press any key to return to menu...'))
    await Input.waitForAnyKey()
  }

  /**
   * Demonstrates keyboard input handling with escape sequence parsing
   * Shows how to capture individual key presses and identify special keys
   */
  private async inputDemo() {
    // Clear screen and position cursor at top
    await Terminal.clearScreen()
    await Cursor.home()
    // Display demo header and instructions
    console.log(Colors.bold('⌨️  Input Handling Demo\n'))
    console.log(Colors.dim('Press various keys to see their names...\n'))
    // Enable raw mode to capture individual key presses
    await Input.enableRawMode()
    let keyCount = 0
    const maxKeys = 10 // Limit to 10 key presses for demo
    // Capture and display key presses
    while (keyCount < maxKeys) {
      try {
        // Wait for a key press
        const key = await Input.readKey()
        // Convert key to readable name
        const keyName =
          key === '\r' // Carriage return (Enter)
            ? 'ENTER'
            : key === ' ' // Space character
            ? 'SPACE'
            : key === '\t' // Tab character
            ? 'TAB'
            : key.length === 1 // Single character
            ? `'${key}'`
            : key // Special keys (arrows, function keys, etc.)
        // Display the key name with color
        console.log(`Key ${keyCount + 1}: ${Colors.green(keyName)}`)
        keyCount++
        // Allow early exit with 'q'
        if (key === 'q' || key === 'Q') {
          break
        }
      } catch (error) {
        // Handle input errors gracefully
        console.log(`Input error: ${error}`)
        break
      }
    }
    // Restore normal terminal input mode
    await Input.disableRawMode()
    // Wait for user input before returning to menu
    console.log('\n' + Colors.dim('Press any key to return to menu...'))
    await Input.waitForAnyKey()
  }

  /**
   * Demonstrates mouse tracking and event parsing
   * Shows how to capture mouse movements, clicks, and button events
   */
  private async mouseDemo() {
    // Clear screen and position cursor at top
    await Terminal.clearScreen()
    await Cursor.home()
    // Display demo header and instructions
    console.log(Colors.bold('🖱️  Mouse Tracking Demo\n'))
    console.log(Colors.dim('Move and click your mouse to see events...\n'))
    console.log(Colors.yellow('Press any key to stop mouse tracking\n'))
    // Enable mouse tracking to capture mouse events
    await Mouse.enableTracking()
    await Input.enableRawMode()
    let eventCount = 0
    const maxEvents = 20 // Limit to 20 events for demo
    // Capture and display mouse events
    while (eventCount < maxEvents) {
      try {
        // Wait for input (could be mouse event or keyboard)
        const input = await Input.readKey()
        // Check if the input is a mouse event
        const mouseEvent = Mouse.parseMouseEvent(input)
        if (mouseEvent) {
          // Map button numbers to readable names
          const buttonNames = ['Left', 'Middle', 'Right']
          const buttonName = buttonNames[mouseEvent.button] || 'Unknown'
          // Display mouse event information
          console.log(
            `Mouse ${mouseEvent.type}: ${Colors.green(buttonName)} button at (${mouseEvent.x}, ${
              mouseEvent.y
            })`
          )
          eventCount++
        } else if (input === 'q' || input === 'Q') {
          // Allow early exit with 'q'
          break
        }
      } catch (error) {
        // Handle errors gracefully
        console.log(`Error: ${error}`)
        break
      }
    }
    // Clean up: disable mouse tracking and raw mode
    await Mouse.disableTracking()
    await Input.disableRawMode()
    // Wait for user input before returning to menu
    console.log('\n' + Colors.dim('Press any key to return to menu...'))
    await Input.waitForAnyKey()
  }

  /**
   * Cleanup method called when the application exits
   * Restores terminal to its original state and displays farewell message
   */
  private async cleanup() {
    // Clear the screen and move cursor to top
    await Terminal.clearScreen()
    await Cursor.home()
    // Restore original window title
    await Terminal.setWindowTitle('Terminal')
    // Ensure cursor is visible
    await Cursor.setCursorVisible(true)
    // Reset terminal to default state
    await Terminal.reset()
    // Display farewell message
    console.log(Colors.bold('Thanks for trying the Deno ANSI Demo! 🎉'))
    console.log(Colors.dim('Visit: https://jsr.io/@neabyte/deno-ansi'))
  }
}

// Application entry point - only run if this file is executed directly
if (import.meta.main) {
  const demo = new ANSIDemo()
  await demo.run()
}
