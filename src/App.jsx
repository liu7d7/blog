import './App.css'
import halftone from './assets/halftone.png'
import tosuto from './assets/tosuto.png'
import halftoneDemo from './assets/halftoning expl.png'

function Post(props) {
  return (
    <div id={props.id}>
      <img
        className={`h-56 sticky z-10 -top-4 w-screen ${props.imgCover ? "object-cover" : "object-scale-down"} border-t-4 border-b-4 border-black -mb-4`}
        style={{backgroundColor: props.bgColor}}
        src={props.imgSrc} alt={props.imgAlt}/>
      <div className={"w-screen flex place-content-center sf-ui-reg text-lg"}>
        <div className={"w-2/5 border-l-4 border-r-4 border-black p-4 mt-4"}>
          <div className={"sf-ui-bold text-6xl pb-2"}>
            {props.title}
          </div>
          <div>
            {props.date}
          </div>
          <div className={"pb-6 mt-2 border-t-4 border-black"}/>
          {props.children}
        </div>
      </div>
    </div>
  )
}

function CodeBlock(props) {
  return (
    <div className={"border-4 border-black"}>
      <div className={"border-b-4 border-black p-2"}>
        {props.lang}
      </div>
      <div className={"p-2 iosevka text-lg"}>
        {props.children}
      </div>
    </div>
  )
}

function App() {
  return (
    <div>
      <Post imgSrc={halftone} imgAlt={"halftoning image"} imgCover={true}
            title={"halftoning with glsl"} date={"april 14, 2024"}
            id={"halftone"}>
        <p>
          Recently I've been working on a game using OpenGL and C. I've been
          having great fun making my own data structures and re-implementing
          all the math from scratch, which has allowed me to gain some more
          understanding of how games work.
        </p>
        <br/>
        <p>
          This game will have a sort of playful, comic-book style feel to it, so
          I first tried to determine what makes comic books look the way they
          do.
        </p>
        <br/>
        <p>
          One thing in common with all comic books is that they're, well,
          printed. This means that they all exhibit a similar visual effect
          that results from printing: halftoning.
        </p>
        <br/>
        <p>
          Printers have a hard challenge to solve. They must be able to print in
          full color (or full grayscale) on a white background, using a limited
          amount of colors of
          ink.
          Halftoning is one method that printers implement to print in this
          manner, and with a little help from <a
          href={"https://en.wikipedia.org/wiki/Halftone"}
          className={"font-medium text-blue-600 hover:text-blue-500 hover:underline"}>Wikipedia</a>,
          I learned that the main ideas are as follows:
        </p>
        <ul className={"list-disc list-inside"}>
          <li>
            The background is white. In order to print darker colors, the
            printer
            must use ink to subtract color from what's already there.
          </li>
          <li>
            One such subtractive color model is CMYK, standing for cyan,
            magenta,
            yellow, and black.
          </li>
          <li>
            Ink pools up in circles on the paper, and by controlling the amount
            of ink released by the jet, circles of different radii can be made.
          </li>
          <li>
            When ink of different colors are placed on top of each other, they
            combine to create different colors.
          </li>
          <li>
            The dots of ink can be placed in a grid, and by rotating each grid
            by
            a different amount, the color combinations can be made.
          </li>
        </ul>
        <br/>
        <p>
          At first, I implemented this in GLSL in two stages. First, I'd convert
          the three-element RGB image of the render to a four-element CMYK
          image.
          Second, I'd use a halftoning shader that could turn the CMYK image
          into
          the dots that made up the 'printed' image.
        </p>
        <br/>
        <p>
          Let's go over the code to convert RGB to CMYK. CMYK happens to be
          symmetrical to RGB, so it's easy to convert between the two.
        </p>
        <br/>
        <CodeBlock lang={"glsl"}>
          vec3 color = texture(u_tex, v_uv).rgb;<br/>
          float r = color.r, g = color.g, b = color.b;<br/>
          float k = 1 - max(r, max(g, b));<br/>
          float light = 1 - k;<br/>
          float c = (light - r) / light;<br/>
          float m = (light - g) / light;<br/>
          float y = (light - b) / light;<br/>
          <br/>
          f_color = vec4(c, m, y, k);
        </CodeBlock>
        <br/>
        <p>
          The halftoning shader works as follows: starting with white as the
          output
          color, I'd run through each of the four CMYK 'screens' of dots, and
          depending on whether that pixel is part of a dot, subtract the
          corresponding
          value from the pixel color.
        </p>
        <br/>
        <p>
          Because CMYK is symmetric to RGB, all one has to do to get the CMYK
          effect is
          subtract a color in RGB to get the corresponding
          CMYK
          color.
        </p>
        <ul className={"list-disc list-inside"}>
          <li>
            Cyan: subtract red
          </li>
          <li>
            Magenta: subtract green
          </li>
          <li>
            Yellow: subtract blue
          </li>
          <li>
            Black: subtract white
          </li>
        </ul>
        <br/>
        <p>
          To get the radius of each circle, I computed the average color of four
          pixels that surrounded each circle's center. Then, deciding whether to
          subtract color from that pixel is easy: if the average color is X%
          magenta, then fill the circle that covers X% of the square. Of course,
          it's impossible to get a circle to fill a square without it going
          over, so this calculation must be repeated for each neighboring
          square, too.
        </p>
        <br/>
        <div className={"w-full flex place-content-center"}>
          <img src={halftoneDemo} alt={"halftone demo"}/>
        </div>
        <br/>
        <p>
          This works well on its own, but in order to get a better result, I had
          to blur the image first so that sharp edges weren't rendered badly.
          The
          unmodified code only samples the four corners of each square, so the
          average
          color of all the pixels in the square isn't taken into account. By
          blurring the image beforehand, we can
          save samples and still get the averaged out result when sampling only
          the corners. The end result is what you see at the top of your screen!
        </p>
      </Post>
      <Post imgSrc={tosuto} imgAlt={"tosuto image"} bgColor={"#1e1e2e"}
            title={"tōsuto: a scripting language"} date={"april 21, 2024"}
            id={"tosuto"}>
        <p>
          I've recently been wanting to get back into making programming
          languages again, so I've started up this project to fulfill that
          desire. Though I didn't have a goal for what the project would be, I
          knew that I wanted it to have a really minimal syntax that, given it
          was my first language, made at least some sense with good amounts of
          continuity.
        </p>
        <br/>
        <p>
          I started off by playing around in my code editor and seeing what
          looked okay. Inspired by jai and odin, I made my function declaration
          syntax super simple, with just a single colon between the name and the
          arguments and body. To make the language more concise, I made boolean
          operators a single keystroke because they're used much more often (in
          my daily use) than bitwise operators are. This also makes the ternary
          operator redundant, as one can simply use ands and ors to build a
          substitute.
        </p>
        <br/>
        <p>
          Let's go over some of the features of the language!
        </p>
        <br/>
        <p>
          Variable declarations, reassignments, and accesses are like most
          walrus operator languages. Semicolons are not required at the end of
          lines.
        </p>
        <br/>
        <CodeBlock lang={"tōsuto"}>
          a := 3<br/>
          a = 4
        </CodeBlock>
        <br/>
        <p>
          Function declarations are as simple as typing out the name and args.
          The body can be a single statement with an arrow, or a block with
          curlies. The last statement is implicitly returned, but the `ret`
          keyword
          can be used to return early.
        </p>
        <br/>
        <CodeBlock lang={"tōsuto"}>
          add : a b -> a + b<br/>
          multiply : a b {'{'}<br/>
          &nbsp;&nbsp;a * b<br/>
          {'}'}
        </CodeBlock>
        <br/>
        <p>
          Because I wanted to try experimenting with different languages,
          identifiers follow the rules specified in Microsoft's <a
          href={"https://learn.microsoft.com/en-us/cpp/cpp/identifiers-cpp?view=msvc-170"}
          className={"font-medium text-blue-600 hover:text-blue-500 hover:underline"}>MSVC
          extensions</a>.
        </p>
        <br/>
        <CodeBlock lang={"tōsuto"}>
          ﾄｰｽﾄ := "toast"<br/>
          toast := "toast"<br/>
          pain_grillé := "toast"
        </CodeBlock>
        <br/>
        <p>
          Objects are very minimal and are similar to Lua's tables, where
          calling
          a member function with a colon will pass the object as the first
          parameter.
          This first parameter can be called anything, which allows greater
          flexibility
          when making constructors or other special functions.
        </p>
        <br/>
        <CodeBlock lang={"tōsuto"}>
          vec2 := [|<br/>
          &nbsp;&nbsp;new : base x y -> base with [|x = x, y = y|]<br/>
          &nbsp;&nbsp;dot : my other -> my.x * other.x + my.y * other.y<br/>
          &nbsp;&nbsp;// ... other stuff<br/>
          |]<br/><br/>

          vec := vec2:new(1, 2)<br/>
          test_dot = vec:dot(vec2:new(3, 3))
        </CodeBlock>
        <br/>
        <p>
          Note the use of the `with` keyword in the previous example. This
          allows
          easy construction of objects, using the existing object as a template
          for
          the constructed object, and a second object that is appended to the
          first.
          Though this is nowhere near the most efficient way to do things, it's
          definitely one of the easiest to implement!
        </p>
        <br/>
        <p>
          The language uses a custom bytecode and vm that I implemented based on
          the one in <a
          href={"https://craftinginterpreters.com/a-bytecode-virtual-machine.html"}
          className={"font-medium text-blue-600 hover:text-blue-500 hover:underline"}>Crafting
          Interpreters</a>, which I optimized heavily. During this optimization,
          I rewrote the vm to move away from the C++ class based implementation
          that I previously used and returned to the land of C, which, in my opinion, turns out
          to be much nicer and easier to write bytecode interpreters in, anyway.
        </p>
        <br/>
        <p>
          Unlike the implementation in Crafting Interpreters, I adapted the vm from
          my original tree-walk interpreter. This means that my compiler works in
          stages, instead of the CI implementation which lexed, parsed, and compiled
          the source file in one step. The compiler works remarkably similarly to
          the tree-walk interpreter as a result, working recursively down the tree
          of nodes. However, instead of running the code, it spits out bytecode,
          an example of which can be seen below.
        </p>
        <br/>
        <CodeBlock lang={"tosuto bytecode"}>
          anonymous:<br/>
          0000 lit_16&nbsp;&nbsp;&nbsp;&lt;function ﾌｨﾎﾞ&gt;<br/>
          0003 glob_d&nbsp;&nbsp;&nbsp;ﾌｨﾎﾞ<br/>
          0006 glob_g&nbsp;&nbsp;&nbsp;ﾌｨﾎﾞ<br/>
          0009 lit_8&nbsp;&nbsp;&nbsp;&nbsp;9.000000<br/>
          0011 call&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;1<br/>
          0013 pop<br/>
          0014 ret<br/>
          <br/>
          anonymous.ﾌｨﾎﾞ:<br/>
          0000 loc_g&nbsp;&nbsp;&nbsp;&nbsp;1<br/>
          0003 lit_8&nbsp;&nbsp;&nbsp;&nbsp;2.000000<br/>
          0005 lt<br/>
          0006 jmpf&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;4&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;(6->13)<br/>
          0009 pop<br/>
          0010 loc_g&nbsp;&nbsp;&nbsp;&nbsp;1<br/>
          0013 jmpf&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;3&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;(13->19)<br/>
          0016 jmp&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;23&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;(16->42)<br/>
          0019 pop<br/>
          0020 glob_g&nbsp;&nbsp;&nbsp;ﾌｨﾎﾞ<br/>
          0023 loc_g&nbsp;&nbsp;&nbsp;&nbsp;1<br/>
          0026 ld_1<br/>
          0027 sub<br/>
          0028 call&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;1<br/>
          0030 glob_g&nbsp;&nbsp;&nbsp;ﾌｨﾎﾞ<br/>
          0033 loc_g&nbsp;&nbsp;&nbsp;&nbsp;1<br/>
          0036 lit_8&nbsp;&nbsp;&nbsp;&nbsp;2.000000<br/>
          0038 sub<br/>
          0039 call&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;1<br/>
          0041 add<br/>
          0042 ret
        </CodeBlock>
        <br/>
        <p>
          That's as far as I've gone with the project so far. I still have ideas
          for things I want to do with it, though, ranging from trying to write
          a more complete standard library for it to making an ahead-of-time
          compiler for it.
        </p>
      </Post>
    </div>
  )
}

export default App
