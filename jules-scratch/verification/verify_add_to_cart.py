import asyncio
from playwright.async_api import async_playwright, expect
import os

async def main():
    async with async_playwright() as p:
        browser = await p.chromium.launch()
        page = await browser.new_page()

        # Get the absolute path to the products.html file
        file_path = os.path.abspath("products.html")

        # Go to the local products.html file
        await page.goto(f"file://{file_path}")

        # Wait for the product grid to be populated
        await page.wait_for_selector(".products-grid .product-card")

        # Find the first product card
        first_card = page.locator(".product-card").first

        # Find the new "Add to Cart" button within the first card
        add_to_cart_button = first_card.locator(".add-to-cart-btn-new")

        # Click the button
        await add_to_cart_button.click()

        # Find the success message
        success_message = first_card.locator(".add-to-cart-message")

        # Assert that the message becomes visible
        await expect(success_message).to_be_visible()

        # Take a screenshot to verify the result
        await page.screenshot(path="jules-scratch/verification/verification.png")

        await browser.close()

if __name__ == "__main__":
    asyncio.run(main())