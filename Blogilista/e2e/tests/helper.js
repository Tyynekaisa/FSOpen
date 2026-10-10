const loginWith = async (page, userName, password) => {
  await page.getByRole('button', { name: 'Kirjaudu sisään' }).click()
  await page.getByLabel('Käyttäjätunnus').fill(userName)
  await page.getByLabel('Salasana').fill(password)
  await page.getByRole('button', { name: 'Kirjaudu' }).click()
}

const createBlog = async (page, title, author, url) => {
  await page.getByRole('button', { name: 'Luo uusi blogi' }).click()
  await page.getByLabel('Otsikko').fill(title)
  await page.getByLabel('Kirjoittaja').fill(author)
  await page.getByLabel('Url').fill(url)
  await page.getByRole('button', { name: 'Tallenna' }).click()
}

export { loginWith, createBlog }
