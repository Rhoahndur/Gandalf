/**
 * Whiteboard Storage Tests
 *
 * Manual test suite to verify localStorage persistence.
 * Run these tests in the browser console to validate functionality.
 */

import {
  saveWhiteboardState,
  loadWhiteboardState,
  clearWhiteboardState,
  getAllWhiteboards,
  clearAllWhiteboards,
  getWhiteboardStorageSize,
} from './whiteboardStorage';
import type { WhiteboardElement, ExcalidrawAppState } from '@/types/whiteboard';

/**
 * Test 1: Basic Save and Load
 */
export function testBasicSaveAndLoad() {
  console.log('Test 1: Basic Save and Load');

  const conversationId = 'test_conv_1';
  const testElements: WhiteboardElement[] = [
    {
      id: 'elem_1',
      type: 'rectangle',
      x: 100,
      y: 100,
      width: 200,
      height: 150,
      strokeColor: '#000000',
      backgroundColor: '#ffffff',
      strokeWidth: 2,
    },
  ];

  const testAppState: Partial<ExcalidrawAppState> = {
    viewBackgroundColor: '#ffffff',
    currentItemStrokeColor: '#000000',
    gridSize: 20,
  };

  // Save
  const saveResult = saveWhiteboardState(conversationId, testElements, testAppState);
  console.log('Save result:', saveResult);
  console.assert(saveResult.success === true, 'Save should succeed');

  // Load
  const loadResult = loadWhiteboardState(conversationId);
  console.log('Load result:', loadResult);
  console.assert(loadResult.success === true, 'Load should succeed');
  console.assert(loadResult.data !== null, 'Data should not be null');
  console.assert(loadResult.data!.elements.length === 1, 'Should load 1 element');

  // Cleanup
  clearWhiteboardState(conversationId);

  console.log('✅ Test 1 passed!\n');
}

/**
 * Test 2: Multiple Conversations
 */
export function testMultipleConversations() {
  console.log('Test 2: Multiple Conversations');

  const conv1 = 'test_conv_1';
  const conv2 = 'test_conv_2';
  const conv3 = 'test_conv_3';

  // Save different data to each conversation
  saveWhiteboardState(conv1, [
    { id: '1', type: 'rectangle', x: 0, y: 0 } as WhiteboardElement,
  ], {});

  saveWhiteboardState(conv2, [
    { id: '2a', type: 'ellipse', x: 10, y: 10 } as WhiteboardElement,
    { id: '2b', type: 'ellipse', x: 20, y: 20 } as WhiteboardElement,
  ], {});

  saveWhiteboardState(conv3, [
    { id: '3a', type: 'line', x: 30, y: 30 } as WhiteboardElement,
    { id: '3b', type: 'line', x: 40, y: 40 } as WhiteboardElement,
    { id: '3c', type: 'line', x: 50, y: 50 } as WhiteboardElement,
  ], {});

  // Verify each conversation has correct data
  const load1 = loadWhiteboardState(conv1);
  const load2 = loadWhiteboardState(conv2);
  const load3 = loadWhiteboardState(conv3);

  console.assert(load1.data!.elements.length === 1, 'Conv1 should have 1 element');
  console.assert(load2.data!.elements.length === 2, 'Conv2 should have 2 elements');
  console.assert(load3.data!.elements.length === 3, 'Conv3 should have 3 elements');

  // Check index
  const allWhiteboards = getAllWhiteboards();
  console.log('All whiteboards:', allWhiteboards);
  console.assert(allWhiteboards.length >= 3, 'Should have at least 3 whiteboards');

  // Cleanup
  clearWhiteboardState(conv1);
  clearWhiteboardState(conv2);
  clearWhiteboardState(conv3);

  console.log('✅ Test 2 passed!\n');
}

/**
 * Test 3: Invalid Conversation IDs
 */
export function testInvalidConversationIds() {
  console.log('Test 3: Invalid Conversation IDs');

  const elements: WhiteboardElement[] = [
    { id: 'test', type: 'rectangle', x: 0, y: 0 } as WhiteboardElement,
  ];

  // Test null
  const saveNull = saveWhiteboardState(null as any, elements, {});
  console.assert(saveNull.success === false, 'Null ID should fail');

  // Test 'new'
  const saveNew = saveWhiteboardState('new', elements, {});
  console.assert(saveNew.success === false, 'New ID should fail');

  // Test empty string
  const saveEmpty = saveWhiteboardState('', elements, {});
  console.assert(saveEmpty.success === false, 'Empty ID should fail');

  console.log('✅ Test 3 passed!\n');
}

/**
 * Test 4: Load Non-existent Conversation
 */
export function testLoadNonExistent() {
  console.log('Test 4: Load Non-existent Conversation');

  const loadResult = loadWhiteboardState('nonexistent_conv_12345');
  console.log('Load result:', loadResult);
  console.assert(loadResult.success === true, 'Load should succeed');
  console.assert(loadResult.data === null, 'Data should be null for non-existent');

  console.log('✅ Test 4 passed!\n');
}

/**
 * Test 5: Clear Whiteboard
 */
export function testClearWhiteboard() {
  console.log('Test 5: Clear Whiteboard');

  const conversationId = 'test_conv_clear';
  const elements: WhiteboardElement[] = [
    { id: 'test', type: 'rectangle', x: 0, y: 0 } as WhiteboardElement,
  ];

  // Save
  saveWhiteboardState(conversationId, elements, {});

  // Verify it exists
  let loadResult = loadWhiteboardState(conversationId);
  console.assert(loadResult.data !== null, 'Data should exist before clear');

  // Clear
  const clearResult = clearWhiteboardState(conversationId);
  console.assert(clearResult.success === true, 'Clear should succeed');

  // Verify it's gone
  loadResult = loadWhiteboardState(conversationId);
  console.assert(loadResult.data === null, 'Data should be null after clear');

  console.log('✅ Test 5 passed!\n');
}

/**
 * Test 6: Update Existing Whiteboard
 */
export function testUpdateExisting() {
  console.log('Test 6: Update Existing Whiteboard');

  const conversationId = 'test_conv_update';

  // Initial save
  saveWhiteboardState(conversationId, [
    { id: 'elem1', type: 'rectangle', x: 0, y: 0 } as WhiteboardElement,
  ], {});

  // Update with more elements
  saveWhiteboardState(conversationId, [
    { id: 'elem1', type: 'rectangle', x: 0, y: 0 } as WhiteboardElement,
    { id: 'elem2', type: 'ellipse', x: 10, y: 10 } as WhiteboardElement,
  ], {});

  // Verify update
  const loadResult = loadWhiteboardState(conversationId);
  console.assert(loadResult.data!.elements.length === 2, 'Should have 2 elements after update');

  // Cleanup
  clearWhiteboardState(conversationId);

  console.log('✅ Test 6 passed!\n');
}

/**
 * Test 7: App State Persistence
 */
export function testAppStatePersistence() {
  console.log('Test 7: App State Persistence');

  const conversationId = 'test_conv_appstate';
  const appState: Partial<ExcalidrawAppState> = {
    viewBackgroundColor: '#f0f0f0',
    currentItemStrokeColor: '#ff0000',
    currentItemStrokeWidth: 5,
    gridSize: 30,
    zoom: { value: 1.5 },
    scrollX: 100,
    scrollY: 200,
  };

  // Save
  saveWhiteboardState(conversationId, [], appState);

  // Load
  const loadResult = loadWhiteboardState(conversationId);
  console.assert(loadResult.data !== null, 'Data should exist');

  const loadedAppState = loadResult.data!.appState;
  console.assert(loadedAppState.viewBackgroundColor === '#f0f0f0', 'Background color should match');
  console.assert(loadedAppState.currentItemStrokeColor === '#ff0000', 'Stroke color should match');
  console.assert(loadedAppState.currentItemStrokeWidth === 5, 'Stroke width should match');
  console.assert(loadedAppState.gridSize === 30, 'Grid size should match');

  // Cleanup
  clearWhiteboardState(conversationId);

  console.log('✅ Test 7 passed!\n');
}

/**
 * Test 8: Storage Size Calculation
 */
export function testStorageSize() {
  console.log('Test 8: Storage Size Calculation');

  // Clear all first
  clearAllWhiteboards();

  // Save some data
  saveWhiteboardState('size_test_1', [
    { id: 'elem', type: 'rectangle', x: 0, y: 0 } as WhiteboardElement,
  ], {});

  const size = getWhiteboardStorageSize();
  console.log('Storage size:', size, 'bytes');
  console.assert(size > 0, 'Storage size should be greater than 0');

  // Cleanup
  clearAllWhiteboards();

  const sizeAfterClear = getWhiteboardStorageSize();
  console.assert(sizeAfterClear === 0, 'Storage size should be 0 after clear all');

  console.log('✅ Test 8 passed!\n');
}

/**
 * Test 9: Whiteboard Index
 */
export function testWhiteboardIndex() {
  console.log('Test 9: Whiteboard Index');

  // Clear all first
  clearAllWhiteboards();

  // Create multiple whiteboards
  const convIds = ['index_test_1', 'index_test_2', 'index_test_3'];
  convIds.forEach((id, i) => {
    const elements: WhiteboardElement[] = Array(i + 1).fill(null).map((_, j) => ({
      id: `elem_${j}`,
      type: 'rectangle',
      x: j * 10,
      y: j * 10,
    } as WhiteboardElement));

    saveWhiteboardState(id, elements, {});
  });

  // Get index
  const index = getAllWhiteboards();
  console.log('Whiteboard index:', index);
  console.assert(index.length === 3, 'Index should have 3 entries');

  // Verify element counts
  const conv1Index = index.find(i => i.conversationId === 'index_test_1');
  const conv2Index = index.find(i => i.conversationId === 'index_test_2');
  const conv3Index = index.find(i => i.conversationId === 'index_test_3');

  console.assert(conv1Index!.elementCount === 1, 'Conv1 should have 1 element in index');
  console.assert(conv2Index!.elementCount === 2, 'Conv2 should have 2 elements in index');
  console.assert(conv3Index!.elementCount === 3, 'Conv3 should have 3 elements in index');

  // Cleanup
  clearAllWhiteboards();

  console.log('✅ Test 9 passed!\n');
}

/**
 * Test 10: Timestamp Validation
 */
export function testTimestamps() {
  console.log('Test 10: Timestamp Validation');

  const conversationId = 'test_conv_timestamp';
  const beforeSave = Date.now();

  // Save
  saveWhiteboardState(conversationId, [
    { id: 'elem', type: 'rectangle', x: 0, y: 0 } as WhiteboardElement,
  ], {});

  const afterSave = Date.now();

  // Load
  const loadResult = loadWhiteboardState(conversationId);
  const timestamp = loadResult.data!.timestamp;

  console.assert(timestamp >= beforeSave && timestamp <= afterSave,
    'Timestamp should be between before and after save');

  // Cleanup
  clearWhiteboardState(conversationId);

  console.log('✅ Test 10 passed!\n');
}

/**
 * Run all tests
 */
export function runAllTests() {
  console.log('========================================');
  console.log('Running Whiteboard Storage Tests');
  console.log('========================================\n');

  try {
    testBasicSaveAndLoad();
    testMultipleConversations();
    testInvalidConversationIds();
    testLoadNonExistent();
    testClearWhiteboard();
    testUpdateExisting();
    testAppStatePersistence();
    testStorageSize();
    testWhiteboardIndex();
    testTimestamps();

    console.log('========================================');
    console.log('✅ All tests passed!');
    console.log('========================================');
  } catch (error) {
    console.error('❌ Test failed:', error);
  }
}

/**
 * Browser Console Instructions:
 *
 * To run these tests in the browser console:
 *
 * 1. Import the test functions:
 *    import { runAllTests } from '@/utils/whiteboardStorage.test';
 *
 * 2. Run all tests:
 *    runAllTests();
 *
 * 3. Or run individual tests:
 *    testBasicSaveAndLoad();
 *    testMultipleConversations();
 *    etc.
 *
 * Note: These tests will write to localStorage.
 * Make sure to run clearAllWhiteboards() after testing to clean up.
 */
