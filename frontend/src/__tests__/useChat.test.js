/**
 * @file Unit tests for the useChat custom hook.
 * Tests initial state, message handling, API interactions,
 * input validation, and cleanup behaviour.
 */

import { renderHook, act } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { useChat } from '../hooks/useChat';

// Mock fetch globally
global.fetch = vi.fn();

describe('useChat hook', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it('initializes with a welcome bot message', () => {
    const { result } = renderHook(() => useChat());
    expect(result.current.messages).toHaveLength(1);
    expect(result.current.messages[0].type).toBe('bot');
    expect(result.current.messages[0].text).toContain('VoteWise AI Assistant');
  });

  it('initializes with empty input and not typing', () => {
    const { result } = renderHook(() => useChat());
    expect(result.current.inputValue).toBe('');
    expect(result.current.isTyping).toBe(false);
  });

  it('exposes setInputValue to update input', () => {
    const { result } = renderHook(() => useChat());
    act(() => {
      result.current.setInputValue('What is voter registration?');
    });
    expect(result.current.inputValue).toBe('What is voter registration?');
  });

  it('does not send if input is empty', async () => {
    const { result } = renderHook(() => useChat());
    act(() => {
      result.current.setInputValue('');
    });
    await act(async () => {
      await result.current.handleSend();
    });
    expect(global.fetch).not.toHaveBeenCalled();
    // Still only the initial welcome message
    expect(result.current.messages).toHaveLength(1);
  });

  it('does not send if input exceeds MAX_QUERY_LENGTH', async () => {
    const { result } = renderHook(() => useChat());
    const longInput = 'a'.repeat(501);
    act(() => {
      result.current.setInputValue(longInput);
    });
    await act(async () => {
      await result.current.handleSend();
    });
    expect(global.fetch).not.toHaveBeenCalled();
  });

  it('sends the message and appends user message optimistically', async () => {
    global.fetch.mockResolvedValueOnce({
      ok: true,
      json: async () => ({ response: 'You can register at your local office.' }),
    });

    const { result } = renderHook(() => useChat());
    act(() => {
      result.current.setInputValue('How do I register?');
    });

    await act(async () => {
      await result.current.handleSend();
    });

    const msgs = result.current.messages;
    expect(msgs.some((m) => m.type === 'user' && m.text === 'How do I register?')).toBe(true);
  });

  it('appends bot response after a successful API call', async () => {
    global.fetch.mockResolvedValueOnce({
      ok: true,
      json: async () => ({ response: 'You can register at your local office.' }),
    });

    const { result } = renderHook(() => useChat());
    act(() => {
      result.current.setInputValue('How do I register?');
    });

    await act(async () => {
      await result.current.handleSend();
    });

    const msgs = result.current.messages;
    expect(msgs.some((m) => m.type === 'bot' && m.text.includes('register'))).toBe(true);
  });

  it('clears the input field after sending', async () => {
    global.fetch.mockResolvedValueOnce({
      ok: true,
      json: async () => ({ response: 'Great question!' }),
    });

    const { result } = renderHook(() => useChat());
    act(() => {
      result.current.setInputValue('Test question');
    });

    await act(async () => {
      await result.current.handleSend();
    });

    expect(result.current.inputValue).toBe('');
  });

  it('shows an error message on API failure', async () => {
    global.fetch.mockRejectedValueOnce(new Error('Network error'));

    const { result } = renderHook(() => useChat());
    act(() => {
      result.current.setInputValue('What is election day?');
    });

    await act(async () => {
      await result.current.handleSend();
    });

    const errorMsg = result.current.messages.find((m) => m.isError);
    expect(errorMsg).toBeDefined();
    expect(errorMsg.type).toBe('bot');
  });

  it('exposes a messagesEndRef for scroll-to-bottom', () => {
    const { result } = renderHook(() => useChat());
    expect(result.current.messagesEndRef).toBeDefined();
    expect(result.current.messagesEndRef).toHaveProperty('current');
  });
});
