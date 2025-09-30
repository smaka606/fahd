import os
from playwright.sync_api import sync_playwright, expect
import time

def run_verification():
    with sync_playwright() as p:
        browser = p.chromium.launch()
        page = browser.new_page()

        # Get the absolute path of the current working directory
        base_path = os.path.abspath(os.getcwd())

        # Home page
        page.goto(f"file://{base_path}/index.html")
        expect(page.locator("#preloader")).to_be_hidden(timeout=10000)
        time.sleep(2) # Additional wait
        page.screenshot(path="jules-scratch/verification/homepage.png", full_page=True)

        # About page
        page.goto(f"file://{base_path}/about.html")
        expect(page.locator("#preloader")).to_be_hidden(timeout=10000)
        time.sleep(2) # Additional wait
        page.screenshot(path="jules-scratch/verification/about_page.png", full_page=True)

        # Products page
        page.goto(f"file://{base_path}/products.html")
        expect(page.locator("#preloader")).to_be_hidden(timeout=10000)
        expect(page.locator(".product-card").first).to_be_visible(timeout=10000)
        time.sleep(2) # Additional wait
        page.screenshot(path="jules-scratch/verification/products_page.png", full_page=True)

        # Contact page
        page.goto(f"file://{base_path}/contact.html")
        expect(page.locator("#preloader")).to_be_hidden(timeout=10000)
        time.sleep(2) # Additional wait
        page.screenshot(path="jules-scratch/verification/contact_page.png", full_page=True)

        browser.close()

if __name__ == "__main__":
    run_verification()
