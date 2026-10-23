const { test, expect, beforeEach, describe } = require('@playwright/test')
const { loginWith, createBlog } = require('./helper')

describe('Blog app', () => {
  beforeEach(async ({ page, request }) => {
    await request.post('http://localhost:3001/api/testing/reset')
    await request.post('http://localhost:3001/api/users', {
      data: {
        name: 'Matti Luukkainen',
        userName: 'mluukkai',
        password: 'salainen',
      },
    })
    await page.goto('http://localhost:5173')
  })

  test('Bloglist is shown', async ({ page }) => {
    await expect(page.getByText('Tervetuloa käyttämään blogilistaa')).toBeVisible()
    await expect(page.getByRole('link', { name: 'Blogilista' })).toBeVisible()
    await expect(page.getByRole('link', { name: 'Kirjaudu sisään' })).toBeVisible()
  })

  test('Login form is shown', async ({ page }) => {
    await page.getByRole('link', { name: 'Kirjaudu sisään' }).click()
    await expect(page.getByRole('button', { name: 'Kirjaudu' })).toBeVisible()
  })

  describe('Login', () => {
    test('succeeds with correct credentials', async ({ page }) => {
      await loginWith(page, 'mluukkai', 'salainen')
      await expect(page.getByText('Tervetuloa Matti Luukkainen!')).toBeVisible()
    })

    test('fails with wrong credentials', async ({ page }) => {
      await loginWith(page, 'mluukkai', 'väärä')
      await expect(page.getByText('Väärä käyttäjätunnus tai salasana')).toBeVisible()

      // const errorDiv = page.locator('.error')
      // await expect(errorDiv).toContainText('Väärä käyttäjätunnus tai salasana')
    })
  })

  describe('When logged in', () => {
    beforeEach(async ({ page }) => {
      await loginWith(page, 'mluukkai', 'salainen')
    })

    test('a new blog can be created', async ({ page }) => {
      await createBlog(
        page,
        'End To End testauksen salat',
        'Teppo Testaaja',
        'https://fullstackopen.com/osa5/end_to_end_testaus',
      )

      await expect(page.getByText('End to End testauksen salat')).toBeVisible()
    })

    test('a blog can be liked', async ({ page }) => {
      await createBlog(
        page,
        'End To End testauksen salat',
        'Teppo Testaaja',
        'https://fullstackopen.com/osa5/end_to_end_testaus',
      )

      await page.getByRole('link', { name: 'End To End testauksen salat' }).click()
      await page.getByRole('button', { name: 'Tykkää' }).click()

      await expect(page.getByText('Tykkäyksiä: 1')).toBeVisible()
    })

    test('a blog can be deleted when the user is the owner', async ({ page }) => {
      await createBlog(
        page,
        'End To End testauksen salat',
        'Teppo Testaaja',
        'https://fullstackopen.com/osa5/end_to_end_testaus',
      )
      await page.getByRole('link', { name: 'End To End testauksen salat' }).click()

      page.on('dialog', async (dialog) => {
        expect(dialog.message()).toBe('Haluatko varmasti poistaa blogin "End To End testauksen salat"?')
        await dialog.accept()
      })

      await page.getByRole('button', { name: 'Poista blogi' }).click()

      // const notificationDiv = page.locator('.notification')
      await expect(page.getByText('Blogi "End To End testauksen salat" poistettu!')).toBeVisible()
      await expect(page.getByText('End To End testauksen salat')).not.toBeVisible()
    })

    test('only blog owner sees delete button', async ({ page, request }) => {
      await createBlog(
        page,
        'End To End testauksen salat',
        'Teppo Testaaja',
        'https://fullstackopen.com/osa5/end_to_end_testaus',
      )
      await page.getByRole('link', { name: 'End To End testauksen salat' }).click()
      await expect(page.getByRole('button', { name: 'Poista blogi' })).toBeVisible()
      await page.getByRole('button', { name: 'Kirjaudu ulos' }).click()

      // luodaan uusi käyttäjä ja kirjaudutaan sisään
      await request.post('http://localhost:3001/api/users', {
        data: {
          name: 'Kaisa Juhola',
          userName: 'kjuhol',
          password: 'salasana',
        },
      })
      await loginWith(page, 'kjuhol', 'salasana')

      // poistonapin ei pitäisi näkyä
      await page.getByRole('link', { name: 'End To End testauksen salat' }).click()
      await expect(page.getByRole('button', { name: 'Poista blogi' })).not.toBeVisible()
    })
  })
})
