import asyncio
from playwright.async_api import async_playwright
import pathlib

async def main():
    async with async_playwright() as p:
        browser = await p.chromium.launch(headless=True)
        page = await browser.new_page()

        # Get absolute path for the HTML files
        base_path = pathlib.Path(__file__).parent.parent.parent.resolve()
        index_path = f"file://{base_path}/index.html"
        products_path = f"file://{base_path}/products.html"

        # 1. Verify index.html (Hero Section)
        await page.goto(index_path)

        # Wait for the main hero animations to complete
        await page.wait_for_timeout(3000) # Wait for GSAP entrance animations

        # Wait for the hero image to be visible
        await page.locator('.hero-image-3d').wait_for(state='visible')

        await page.screenshot(path="jules-scratch/verification/01_index_hero_animation.png")

        # 2. Verify products.html (Card Animations)
        await page.goto(products_path)

        # Wait for the initial batch of cards to animate in
        await page.wait_for_timeout(2000)

        # Scroll down to trigger more card animations
        await page.evaluate('window.scrollBy(0, 500)')
        await page.wait_for_timeout(1000) # Wait for scroll-triggered animations

        # Hover over a product card to show the hover effect
        product_card = page.locator('.product-card').nth(2) # Pick the 3rd card
        if product_card:
            await product_card.hover()
            await page.wait_for_timeout(500) # Wait for hover transition

        await page.screenshot(path="jules-scratch/verification/02_products_card_animations.png")

        await browser.close()

if __name__ == '__main__':
    asyncio.run(main())