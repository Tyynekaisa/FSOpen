const { test, expect, beforeEach, afterEach, describe } = require('@playwright/test')
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

  test('Login form is shown', async ({ page }) => {
    await expect(page.getByText('Tervetuloa käyttämään blogilistaa')).toBeVisible()
    await expect(page.getByRole('button', { name: 'Kirjaudu sisään' })).toBeVisible()
  })

  describe('Login', () => {
    test('succeeds with correct credentials', async ({ page }) => {
      await loginWith(page, 'mluukkai', 'salainen')
      await expect(page.getByText('Olet kirjautunut sisään nimellä Matti Luukkainen!')).toBeVisible()
    })

    test('fails with wrong credentials', async ({ page }) => {
      await loginWith(page, 'mluukkai', 'väärä')

      const errorDiv = page.locator('.error')
      await expect(errorDiv).toContainText('Väärä käyttäjätunnus tai salasana')
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

      await page.getByRole('button', { name: 'Näytä tiedot' }).click()
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
      await page.getByRole('button', { name: 'Näytä tiedot' }).click()

      page.on('dialog', async (dialog) => {
        expect(dialog.message()).toBe('Haluatko varmasti poistaa blogin "End To End testauksen salat"?')
        await dialog.accept()
      })

      await page.getByRole('button', { name: 'Poista blogi' }).click()

      const notificationDiv = page.locator('.notification')
      await expect(notificationDiv).toContainText('Blogi "End To End testauksen salat" poistettu!')
      await expect(page.getByText('End To End testauksen salat')).not.toBeVisible()
    })

    test('only blog owner sees delete button', async ({ page, request }) => {
      await createBlog(
        page,
        'End To End testauksen salat',
        'Teppo Testaaja',
        'https://fullstackopen.com/osa5/end_to_end_testaus',
      )
      await page.getByRole('button', { name: 'Näytä tiedot' }).click()
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
      await page.getByRole('button', { name: 'Näytä tiedot' }).click()
      await expect(page.getByRole('button', { name: 'Poista blogi' })).not.toBeVisible()
    })

    test('blogs are ordered by likes', async ({ page }) => {
      // Luodaan blogeja
      await createBlog(page, 'Eka blogi', 'Teppo Testaaja', 'https://www.esimerkki1.com')
      await expect(page.locator('.blogList')).toContainText('Eka blogi')
      await createBlog(page, 'Toka blogi', 'Matti Meikäläinen', 'https://www.esimerkki2.com')
      await expect(page.locator('.blogList')).toContainText('Toka blogi')
      await createBlog(page, 'Kolmas blogi', 'Tuija Teikäläinen', 'https://www.esimerkki3.com')
      await expect(page.locator('.blogList')).toContainText('Kolmas blogi')

      const firstBlog = page.locator('.blog').filter({ has: page.getByRole('heading', { name: 'Eka blogi' }) })
      const secondBlog = page.locator('.blog').filter({ has: page.getByRole('heading', { name: 'Toka blogi' }) })
      const thirdBlog = page.locator('.blog').filter({ has: page.getByRole('heading', { name: 'Kolmas blogi' }) })
      const notificationDiv = page.locator('.notification')

      // Tykätään ekasta blogista kerran, tokasta neljä kertaa ja kolmannesta kaksi kertaa
      await firstBlog.getByRole('button', { name: 'Näytä tiedot' }).click()
      await expect(page.getByText('Teppo Testaaja')).toBeVisible()
      await firstBlog.getByRole('button', { name: 'Tykkää' }).click()
      await expect(notificationDiv).toContainText('Tykkäsit blogista Eka blogi')
      await notificationDiv.getByText('Tykkäsit blogista Eka blogi').waitFor({ state: 'hidden' })

      await secondBlog.getByRole('button', { name: 'Näytä tiedot' }).click()
      await expect(page.getByText('Matti Meikäläinen')).toBeVisible()
      await secondBlog.getByRole('button', { name: 'Tykkää' }).click()
      await expect(notificationDiv).toContainText('Tykkäsit blogista Toka blogi')
      await notificationDiv.getByText('Tykkäsit blogista Toka blogi').waitFor({ state: 'hidden' })
      await secondBlog.getByRole('button', { name: 'Tykkää' }).click()
      await expect(notificationDiv).toContainText('Tykkäsit blogista Toka blogi')
      await notificationDiv.getByText('Tykkäsit blogista Toka blogi').waitFor({ state: 'hidden' })
      await secondBlog.getByRole('button', { name: 'Tykkää' }).click()
      await expect(notificationDiv).toContainText('Tykkäsit blogista Toka blogi')
      await notificationDiv.getByText('Tykkäsit blogista Toka blogi').waitFor({ state: 'hidden' })
      await secondBlog.getByRole('button', { name: 'Tykkää' }).click()
      await expect(notificationDiv).toContainText('Tykkäsit blogista Toka blogi')
      await notificationDiv.getByText('Tykkäsit blogista Toka blogi').waitFor({ state: 'hidden' })

      await thirdBlog.getByRole('button', { name: 'Näytä tiedot' }).click()
      await expect(page.getByText('Tuija Teikäläinen')).toBeVisible()
      await thirdBlog.getByRole('button', { name: 'Tykkää' }).click()
      await expect(notificationDiv).toContainText('Tykkäsit blogista Kolmas blogi')
      await notificationDiv.getByText('Tykkäsit blogista Kolmas blogi').waitFor({ state: 'hidden' })
      await thirdBlog.getByRole('button', { name: 'Tykkää' }).click()
      await expect(notificationDiv).toContainText('Tykkäsit blogista Kolmas blogi')
      await notificationDiv.getByText('Tykkäsit blogista Kolmas blogi').waitFor({ state: 'hidden' })

      // blogList järjestys pitäisi nyt olla toka, kolmas, eka
      const blogList = page.locator('.blogList')
      const titles = await blogList.locator('h4').allTextContents()

      expect(titles).toEqual(['Toka blogi', 'Kolmas blogi', 'Eka blogi'])
    })
  })
})
