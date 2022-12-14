"""flask engine for web browser"""
from flask import Flask, render_template
app = Flask(__name__)

@app.route('/', strict_slashes=False)
def web_page():
    """runs the only web page"""
    return render_template('index.html')

if __name__ == "__main__":
    """ Main Function """
    app.run(host='0.0.0.0', port=5000)
