import os
from playwright.sync_api import sync_playwright, expect

def run_verification():
    with sync_playwright() as p:
        browser = p.chromium.launch(headless=True)
        page = browser.new_page()

        # Get the absolute path to the HTML files
        base_path = os.path.abspath(os.path.join(os.path.dirname(__file__), '..', '..'))

        # Verify index.html
        index_path = f'file://{os.path.join(base_path, "index.html")}'
        page.goto(index_path)

        # Wait for preloader to hide
        page.wait_for_selector('#preloader', state='hidden')
        # Wait for product preview to load
        page.wait_for_selector('#products-preview-grid .product-card')

        # Check that the cart button is not present
        cart_btn = page.locator('.cart-btn')
        expect(cart_btn).to_have_count(0)

        page.screenshot(path="jules-scratch/verification/index_page.png")

        # Verify products.html
        products_path = f'file://{os.path.join(base_path, "products.html")}'
        page.goto(products_path)

        # Wait for product grid to load
        page.wait_for_selector('#products-grid .product-card')

        # Check that the "Add to Cart" button is not present on product cards
        add_to_cart_btn = page.locator('.add-to-cart-btn')
        expect(add_to_cart_btn).to_have_count(0)

        page.screenshot(path="jules-scratch/verification/products_page.png")

        browser.close()

if __name__ == "__main__":
    run_verification()