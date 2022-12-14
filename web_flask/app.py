"""flask engine for web browser"""
from flask import Flask, render_template
app = Flask(__name__)

@app.route('/', strict_slashes=False)
def web_page():
    """runs the only web page"""
    return render_template('bbbb.html')

@app.route('/test', strict_slashes=False)
def test():
    """page for testing"""
    return render_template('test.html')
if __name__ == "__main__":
    """ Main Function """
    app.run(host='0.0.0.0', port=5000)
