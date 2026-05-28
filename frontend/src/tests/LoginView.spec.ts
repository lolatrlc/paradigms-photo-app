import { describe, it, expect } from 'vitest';

import { mount } from '@vue/test-utils';

import LoginView from '../views/LoginView.vue';

import { createPinia } from 'pinia';

import { createRouter, createWebHistory } from 'vue-router';

const router = createRouter({
  history: createWebHistory(),
  routes: [],
});

describe('LoginView', () => {

  it('should render login title', async () => {

    const wrapper = mount(LoginView, {
      global: {
        plugins: [createPinia(), router],
      },
    });

    expect(wrapper.text()).toContain('Login');
  });

  it('should render login button', async () => {

    const wrapper = mount(LoginView, {
      global: {
        plugins: [createPinia(), router],
      },
    });

    const button = wrapper.find('button');

    expect(button.exists()).toBe(true);

    expect(button.text()).toContain('Login');
  });
});